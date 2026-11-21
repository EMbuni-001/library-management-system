
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookGrid from '../components/BookGrid';
import GenreFilter from '../components/GenreFilter';
import SearchBar from '../components/SearchBar';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

function HomePage() {
  const [genreId, setGenreId] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { recentlyViewed } = useRecentlyViewed();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 sm:text-3xl">
          Library catalog
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          Search the collection, filter by genre, and save titles to your reading list.
        </p>
      </header>

      {recentlyViewed.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-400">
              Recently viewed
            </h2>
            <Link
              to="/"
              className="text-sm text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline underline-offset-2 transition-colors duration-200"
              onClick={(e) => {
                // Allow clicking to scroll to top but not navigate away
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Clear
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {recentlyViewed.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-sm transition-all duration-200 group"
              >
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 line-clamp-2 transition-colors duration-200">
                  {book.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {book.author}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

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
            className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 transition-colors duration-200 hover:border-teal-400 dark:hover:border-teal-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800"
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