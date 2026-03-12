# NETFLIC Clone (Local-Only Personal Streaming Dashboard)

A Netflix-inspired full-stack app for organizing and playing your downloaded local media.

## Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Player:** Native HTML5 video with controls, speed, subtitles (`.srt`)
- **Data:** JSON metadata + local folder scan

## Features
- Dark cinematic Netflix-like UI with hero banner and horizontal rows.
- Rows: Trending, Recently Added, Action, Comedy, Series, Continue Watching, Favorites.
- Instant search/filter (title/genre/year) without page reload.
- Local media scanner for `mp4`, `mkv`, `avi`, `mov`.
- Detail page with metadata, play button, genre tags, favorites.
- Playback page with subtitles and “Up Next” recommendations.
- Local-only profile selection, history, favorites, continue-watching persistence.
- Admin panel: scan folder, edit metadata, upload thumbnails, feature content.
- Responsive layout, lazy-loaded images, smooth hover transitions.

## Project Structure

```text
.
├── backend
│   ├── data
│   │   ├── media-metadata.json
│   │   └── user-data.json
│   ├── media
│   │   ├── movies
│   │   └── series
│   ├── subtitles
│   ├── thumbnails
│   └── src/server.js
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── contexts
│   │   ├── pages
│   │   └── services
└── package.json
```

## Setup
1. Install dependencies:
   ```bash
   npm run install:all
   ```
2. Start full stack dev servers:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173`.

## Local Content Setup
1. Put your videos into:
   - `backend/media/movies`
   - `backend/media/series`
2. Optionally place subtitles in `backend/subtitles` and set `subtitlePath` in metadata.
3. Use **Admin → Scan Local Folder** to import uncataloged files.
4. Edit metadata in Admin panel for title/description/genre/featured status.

## Metadata Format
Media records are stored in `backend/data/media-metadata.json`:
```json
{
  "id": "movie-example",
  "title": "Example",
  "type": "movie",
  "genre": ["Action"],
  "year": 2024,
  "duration": "1h 40m",
  "description": "...",
  "featured": false,
  "trending": true,
  "thumbnail": "/thumbnails/example.svg",
  "banner": "/thumbnails/example-banner.svg",
  "filePath": "movies/example.mp4",
  "subtitlePath": "example.srt"
}
```

## Docker (Optional)
```bash
docker build -t netflic-local .
docker run -p 4000:4000 -p 5173:5173 netflic-local
```

## Notes
- This project is designed for **personal offline/local usage**.
- No external APIs, auth, cloud storage, or subscription logic.
