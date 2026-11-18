
import { useEffect, useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Each keystroke schedules a search and cancels the previous one.
    // Only a pause of 400ms lets a request actually fire.
    const timer = setTimeout(() => {
      onSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div>
      <label htmlFor="catalog-search" className="sr-only">
        Search the catalog
      </label>
      <input
        id="catalog-search"
        type="search"
        placeholder="Search by title or author..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 transition-colors duration-200 hover:border-teal-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:border-teal-500 dark:focus:ring-teal-800"
      />
    </div>
  );
}

export default SearchBar;