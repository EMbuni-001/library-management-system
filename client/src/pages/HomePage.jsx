
import { useState } from 'react';
import BookGrid from '../components/BookGrid';
import SearchBar from '../components/SearchBar';

function HomePage() {
  const [genreId, setGenreId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Library Catalog</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="w-full md:w-1/3">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={genreId} 
            onChange={(e) => setGenreId(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Genres</option>
            <option value="1">Fiction</option>
            <option value="2">Science Fiction</option>
            <option value="3">Mystery</option>
            <option value="4">Non-Fiction</option>
          </select>

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

      <BookGrid genreId={genreId} searchQuery={searchQuery} sortBy={sortBy} />
    </div>
  );
}

export default HomePage;