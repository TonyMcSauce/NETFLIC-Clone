import { Link } from 'react-router-dom';

const MediaCard = ({ item }) => (
  <Link to={`/details/${item.id}`} className="card-hover min-w-[170px] overflow-hidden rounded-md bg-surface md:min-w-[220px]">
    <img src={item.thumbnail} alt={item.title} loading="lazy" className="h-24 w-full object-cover md:h-32" />
    <div className="space-y-1 p-2">
      <p className="truncate text-sm font-semibold">{item.title}</p>
      <p className="text-xs text-zinc-400">{item.genre?.join(' • ')}</p>
      <p className="text-xs text-zinc-500">{item.duration}</p>
    </div>
  </Link>
);

export default MediaCard;
