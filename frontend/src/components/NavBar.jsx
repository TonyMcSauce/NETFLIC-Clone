import { Link, NavLink } from 'react-router-dom';

const NavBar = () => (
  <header className="fixed top-0 z-40 w-full bg-gradient-to-b from-black via-black/80 to-transparent px-4 md:px-8">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
      <Link to="/" className="text-2xl font-extrabold tracking-wide text-netflixRed">
        NETFLIC
      </Link>
      <nav className="flex items-center gap-4 text-sm text-zinc-200">
        <NavLink to="/" className="hover:text-white">Home</NavLink>
        <NavLink to="/admin" className="hover:text-white">Admin</NavLink>
        <NavLink to="/profiles" className="hover:text-white">Profiles</NavLink>
      </nav>
    </div>
  </header>
);

export default NavBar;
