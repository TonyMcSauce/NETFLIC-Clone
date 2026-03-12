import { Link } from 'react-router-dom';

const HeroBanner = ({ item }) => {
  if (!item) return null;

  return (
    <section className="relative h-[68vh] min-h-[420px] w-full overflow-hidden">
      <img src={item.banner || item.thumbnail} alt={item.title} className="h-full w-full object-cover opacity-55" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-16 mx-auto max-w-7xl px-4 md:px-8">
        <h1 className="max-w-2xl text-4xl font-black md:text-6xl">{item.title}</h1>
        <p className="mt-4 max-w-xl text-sm text-zinc-200 md:text-base">{item.description}</p>
        <div className="mt-5 flex gap-3">
          <Link to={`/player/${item.id}`} className="rounded bg-white px-5 py-2 text-sm font-semibold text-black">Play</Link>
          <Link to={`/details/${item.id}`} className="rounded bg-zinc-700/90 px-5 py-2 text-sm font-semibold">More Info</Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
