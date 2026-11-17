
import { useState } from 'react';
import BookGrid from '../components/BookGrid';
import GenreFilter from '../components/GenreFilter';
import SearchBar from '../components/SearchBar';

function HomePage() {
  const [genreId, setGenreId] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Search the collection, filter by genre and save titles to your
          reading list.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <SearchBar onSearch={setSearch} />
        </div>

        <div>
          <label htmlFor="genre-filter" className="sr-only">
            Filter by genre
          </label>
          <GenreFilter value={genreId} onChange={setGenreId} />
        </div>

        <div>
          <label htmlFor="sort-control" className="sr-only">
            Sort books
          </label>
          <select
            id="sort-control"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors duration-200 hover:border-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Sort by...</option>
            <option value="title">Title (A to Z)</option>
            <option value="author">Author (A to Z)</option>
          </select>
        </div>
      </div>

      <BookGrid genreId={genreId} search={search} sortBy={sortBy} />
    </div>
  );
}

export default HomePage;