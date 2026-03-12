import { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import SearchBar from '../components/SearchBar';
import { useApp } from '../contexts/AppContext';

const HomePage = () => {
  const { loading, featured, rows, reload } = useApp();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = search.trim();
      if (trimmed) {
        const [term, maybeYear] = trimmed.split(' ');
        reload({ q: trimmed, genre: term, year: /^\d{4}$/.test(maybeYear || '') ? maybeYear : '' });
      } else {
        reload();
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [search]);

  if (loading) return <p className="px-6 pt-24">Loading your library...</p>;

  return (
    <div className="pb-10">
      <HeroBanner item={featured} />
      <main className="mx-auto mt-[-40px] max-w-7xl space-y-8 px-4 md:px-8">
        <SearchBar value={search} onChange={setSearch} />
        <ContentRow title="Continue Watching" items={rows.continueWatching} />
        <ContentRow title="Trending" items={rows.trending} />
        <ContentRow title="Recently Added" items={rows.recentlyAdded} />
        <ContentRow title="Action" items={rows.action} />
        <ContentRow title="Comedy" items={rows.comedy} />
        <ContentRow title="Series" items={rows.series} />
        <ContentRow title="Favorites" items={rows.favorites} />
      </main>
    </div>
  );
};

export default HomePage;
