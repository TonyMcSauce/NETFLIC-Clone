const SearchBar = ({ value, onChange }) => (
  <input
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder="Search title, genre, year..."
    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm outline-none ring-netflixRed focus:ring"
  />
);

export default SearchBar;
