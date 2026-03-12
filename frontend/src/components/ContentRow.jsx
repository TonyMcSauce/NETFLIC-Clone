import MediaCard from './MediaCard';

const ContentRow = ({ title, items = [] }) => {
  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default ContentRow;
