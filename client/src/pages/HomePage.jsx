
import { useState, useEffect } from 'react';
import BookGrid from '../components/BookGrid';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';

function HomePage() {
  const [genreId, setGenreId] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    console.log('🏠 HomePage search state changed to:', search);
  }, [search]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Library Catalog
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="w-full md:w-1/3">
          <SearchBar onSearch={setSearch} />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <GenreFilter value={genreId} onChange={setGenreId} />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Sort By...</option>
            <option value="title">Title (A-Z)</option>
            <option value="author">Author (A-Z)</option>
          </select>
        </div>
      </div>

      <BookGrid genreId={genreId} search={search} sortBy={sortBy} />
    </div>
  );
}

export default HomePage;