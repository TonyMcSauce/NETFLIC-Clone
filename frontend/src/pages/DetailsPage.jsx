import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useApp } from '../contexts/AppContext';

const DetailsPage = () => {
  const { id } = useParams();
  const { userData, reload } = useApp();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.getMediaById(id).then((payload) => setItem(payload.item));
  }, [id]);

  if (!item) return <p className="pt-24 px-6">Loading...</p>;

  const profileId = userData?.activeProfile;
  const isFavorite = userData?.favorites?.[profileId]?.includes(item.id);

  const handleFavorite = async () => {
    await api.toggleFavorite(item.id);
    await reload();
  };

  return (
    <div className="pt-20">
      <div className="relative h-[45vh]">
        <img src={item.banner || item.thumbnail} className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 md:px-8">
        <h1 className="text-4xl font-bold">{item.title}</h1>
        <p className="text-zinc-300">{item.description}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {item.genre?.map((tag) => (
            <span key={tag} className="rounded bg-zinc-800 px-3 py-1">{tag}</span>
          ))}
        </div>
        <p className="text-sm text-zinc-400">{item.year} • {item.duration}</p>
        <div className="flex gap-3">
          <Link to={`/player/${item.id}`} className="rounded bg-white px-5 py-2 text-sm font-semibold text-black">Play</Link>
          <button onClick={handleFavorite} className="rounded bg-zinc-700 px-5 py-2 text-sm font-semibold">
            {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
