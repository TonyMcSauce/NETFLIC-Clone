import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';

const AdminPage = () => {
  const { media, reload } = useApp();
  const [selectedId, setSelectedId] = useState('');
  const selected = media.find((item) => item.id === selectedId) || media[0];
  const [form, setForm] = useState(selected || {});

  const syncForm = (id) => {
    setSelectedId(id);
    const target = media.find((item) => item.id === id);
    setForm(target || {});
  };

  const save = async () => {
    await api.updateMedia(form.id, { ...form, genre: form.genreText.split(',').map((v) => v.trim()) });
    await reload();
  };

  const scan = async () => {
    await api.scanMedia();
    await reload();
  };

  const upload = async (file) => {
    if (!file) return;
    const payload = await api.uploadThumbnail(file);
    setForm((current) => ({ ...current, thumbnail: payload.path }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 pb-12 pt-24 md:px-8">
      <div className="flex flex-wrap gap-2">
        <button onClick={scan} className="rounded bg-netflixRed px-4 py-2 text-sm font-semibold">Scan Local Folder</button>
        <select value={selected?.id || ''} onChange={(e) => syncForm(e.target.value)} className="rounded bg-zinc-900 px-4 py-2">
          {media.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
      </div>
      {selected && (
        <div className="grid gap-3 rounded bg-zinc-950 p-4">
          <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded bg-zinc-800 p-2" placeholder="Title" />
          <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded bg-zinc-800 p-2" placeholder="Description" />
          <input value={(form.genre || []).join(', ')} onChange={(e) => setForm({ ...form, genreText: e.target.value, genre: e.target.value.split(',').map((v) => v.trim()) })} className="rounded bg-zinc-800 p-2" placeholder="Genres comma separated" />
          <label className="text-sm text-zinc-300">Upload Thumbnail
            <input type="file" onChange={(e) => upload(e.target.files?.[0])} className="mt-1 block text-xs" />
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />Feature on homepage</label>
          <button onClick={save} className="rounded bg-white px-4 py-2 text-sm font-semibold text-black">Save Metadata</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
