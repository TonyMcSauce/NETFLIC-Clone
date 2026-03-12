import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const mediaDir = path.join(rootDir, 'media');
const thumbnailsDir = path.join(rootDir, 'thumbnails');
const subtitlesDir = path.join(rootDir, 'subtitles');
const metadataPath = path.join(dataDir, 'media-metadata.json');
const userDataPath = path.join(dataDir, 'user-data.json');

const app = express();
const port = process.env.PORT || 4000;
const supportedExtensions = new Set(['.mp4', '.mkv', '.avi', '.mov']);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/media', express.static(mediaDir));
app.use('/thumbnails', express.static(thumbnailsDir));
app.use('/subtitles', express.static(subtitlesDir));

const upload = multer({ dest: thumbnailsDir });

const safeReadJson = async (filePath, fallback) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return fallback;
  }
};

const writeJson = async (filePath, value) => {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2));
};

const inferTitle = (fileName) =>
  fileName
    .replace(path.extname(fileName), '')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const walk = async (dir, base = '') => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const relative = path.join(base, entry.name);
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath, relative);
      }
      return [relative];
    })
  );
  return files.flat();
};

const scanMediaFiles = async () => {
  const files = await walk(mediaDir);
  return files.filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()));
};

// Build Netflix-like rails from metadata plus user state.
const buildRowData = (items, continueWatching, favorites) => {
  const now = Date.now();
  const trending = items.filter((item) => item.trending);
  const recentlyAdded = [...items].sort((a, b) => new Date(b.addedAt || now) - new Date(a.addedAt || now)).slice(0, 12);
  const action = items.filter((item) => item.genre?.includes('Action'));
  const comedy = items.filter((item) => item.genre?.includes('Comedy'));
  const series = items.filter((item) => item.type === 'series');
  const continueList = continueWatching
    .map((entry) => ({ ...entry, media: items.find((item) => item.id === entry.mediaId) }))
    .filter((entry) => entry.media)
    .map((entry) => ({ ...entry.media, progress: entry.progress }));
  const favoritesList = favorites.map((id) => items.find((item) => item.id === id)).filter(Boolean);

  return {
    trending,
    recentlyAdded,
    action,
    comedy,
    series,
    continueWatching: continueList,
    favorites: favoritesList
  };
};

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/media', async (req, res) => {
  const metadata = await safeReadJson(metadataPath, { items: [] });
  const userData = await safeReadJson(userDataPath, {});
  const activeProfile = userData.activeProfile;
  const rows = buildRowData(
    metadata.items,
    userData.continueWatching?.[activeProfile] || [],
    userData.favorites?.[activeProfile] || []
  );

  const query = req.query.q?.toString().toLowerCase();
  const genre = req.query.genre?.toString().toLowerCase();
  const year = req.query.year?.toString();

  const filtered = metadata.items.filter((item) => {
    const matchesQuery = !query || [item.title, item.seriesTitle, item.description].filter(Boolean).some((value) => value.toLowerCase().includes(query));
    const matchesGenre = !genre || item.genre?.some((g) => g.toLowerCase().includes(genre));
    const matchesYear = !year || `${item.year}` === year;
    return matchesQuery && matchesGenre && matchesYear;
  });

  res.json({
    items: filtered,
    featured: metadata.items.find((item) => item.featured) || metadata.items[0] || null,
    rows
  });
});

app.get('/api/media/:id', async (req, res) => {
  const metadata = await safeReadJson(metadataPath, { items: [] });
  const item = metadata.items.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Media not found' });

  const upNext = metadata.items
    .filter((entry) => entry.id !== item.id && (entry.type === item.type || entry.genre?.some((g) => item.genre?.includes(g))))
    .slice(0, 6);

  res.json({ item, upNext });
});

// Scan local media directories and append uncataloged files into metadata JSON.
app.post('/api/media/scan', async (_, res) => {
  const metadata = await safeReadJson(metadataPath, { items: [] });
  const files = await scanMediaFiles();
  const existingFileSet = new Set(metadata.items.map((item) => item.filePath));

  const newItems = files
    .filter((relativePath) => !existingFileSet.has(relativePath))
    .map((relativePath) => {
      const fileName = path.basename(relativePath);
      const inferredTitle = inferTitle(fileName);
      const id = inferredTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        id,
        title: inferredTitle,
        type: relativePath.includes('series') ? 'series' : 'movie',
        genre: ['Uncategorized'],
        year: new Date().getFullYear(),
        duration: 'Unknown',
        description: 'Add a description from the admin panel.',
        featured: false,
        trending: false,
        thumbnail: '/thumbnails/default-poster.svg',
        banner: '/thumbnails/default-banner.svg',
        filePath: relativePath,
        addedAt: new Date().toISOString()
      };
    });

  const updated = { items: [...metadata.items, ...newItems] };
  await writeJson(metadataPath, updated);

  res.json({ scanned: files.length, added: newItems.length, items: updated.items });
});

app.put('/api/media/:id', async (req, res) => {
  const metadata = await safeReadJson(metadataPath, { items: [] });
  const idx = metadata.items.findIndex((item) => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Media not found' });

  metadata.items[idx] = { ...metadata.items[idx], ...req.body };
  await writeJson(metadataPath, metadata);
  res.json(metadata.items[idx]);
});

app.post('/api/admin/upload-thumbnail', upload.single('thumbnail'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const extension = path.extname(req.file.originalname) || '.jpg';
  const finalName = `${path.basename(req.file.filename)}${extension}`;
  await fs.rename(req.file.path, path.join(thumbnailsDir, finalName));
  res.json({ path: `/thumbnails/${finalName}` });
});

app.get('/api/profiles', async (_, res) => {
  const userData = await safeReadJson(userDataPath, {});
  res.json(userData);
});

app.post('/api/profiles/active', async (req, res) => {
  const userData = await safeReadJson(userDataPath, {});
  userData.activeProfile = req.body.profileId;
  await writeJson(userDataPath, userData);
  res.json({ activeProfile: userData.activeProfile });
});

app.post('/api/user/favorites/:mediaId', async (req, res) => {
  const userData = await safeReadJson(userDataPath, {});
  const profile = userData.activeProfile;
  userData.favorites[profile] = userData.favorites[profile] || [];
  const list = userData.favorites[profile];
  const mediaId = req.params.mediaId;
  userData.favorites[profile] = list.includes(mediaId) ? list.filter((id) => id !== mediaId) : [...list, mediaId];
  await writeJson(userDataPath, userData);
  res.json({ favorites: userData.favorites[profile] });
});

app.post('/api/user/progress', async (req, res) => {
  const { mediaId, currentTime, progress } = req.body;
  const userData = await safeReadJson(userDataPath, {});
  const profile = userData.activeProfile;

  userData.continueWatching[profile] = userData.continueWatching[profile] || [];
  const existingIndex = userData.continueWatching[profile].findIndex((entry) => entry.mediaId === mediaId);
  const payload = { mediaId, currentTime, progress, updatedAt: new Date().toISOString() };

  if (existingIndex >= 0) {
    userData.continueWatching[profile][existingIndex] = payload;
  } else {
    userData.continueWatching[profile].push(payload);
  }

  userData.history[profile] = userData.history[profile] || [];
  userData.history[profile].unshift({ mediaId, watchedAt: new Date().toISOString(), progress });
  userData.history[profile] = userData.history[profile].slice(0, 50);

  await writeJson(userDataPath, userData);
  res.json({ continueWatching: userData.continueWatching[profile] });
});

app.listen(port, () => {
  console.log(`NETFLIC backend listening on http://localhost:${port}`);
});
