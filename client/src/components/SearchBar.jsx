
import { useEffect, useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div>
      <label htmlFor="catalog-search" className="sr-only">Search the catalog</label>
      <input
        id="catalog-search"
        type="search"
        placeholder="Search by title or author..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors duration-200 hover:border-slate-400 dark:hover:border-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
      />
    </div>
  );
}

export default SearchBar;