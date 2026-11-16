
import { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    console.log('SearchBar useEffect triggered. Query:', query);
    
    const timer = setTimeout(() => {
      console.log('Calling onSearch with:', query);
      onSearch(query);
    }, 400);

    return () => {
      console.log('Clearing previous timer');
      clearTimeout(timer);
    };
  }, [query, onSearch]);

  return (
    <input
      type="text"
      placeholder="Search by title or author..."
      value={query}
      onChange={(e) => {
        console.log('User typed:', e.target.value);
        setQuery(e.target.value);
      }}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default SearchBar;