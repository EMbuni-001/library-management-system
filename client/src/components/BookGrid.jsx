
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import BookCard from './BookCard';

function BookGrid({ genreId, search, sortBy }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchBooks() {
      setLoading(true);
      setError(null);

      try {
        const params = { limit: 50 };

        if (genreId) {
          params.genreId = genreId;
        }
        if (search) {
          params.search = search;
        }

        const response = await api.get('/books', { params });

        const payload = response.data?.data ?? response.data;
        const list = Array.isArray(payload) ? [...payload] : [];
        const total = response.data?.meta?.total ?? list.length;

        if (sortBy === 'title') {
          list.sort((a, b) => String(a.title).localeCompare(String(b.title)));
        } else if (sortBy === 'author') {
          list.sort((a, b) => String(a.author).localeCompare(String(b.author)));
        }

        if (active) {
          setBooks(list);
          setTotalCount(total);
        }
      } catch (err) {
        if (active) {
          setError('Could not load books right now. Please try again shortly.');
          setBooks([]);
          setTotalCount(0);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchBooks();

    return () => {
      active = false;
    };
  }, [genreId, search, sortBy]);

  // Build a description of active filters for the count display
  const filterDescription = [
    search ? `for "${search}"` : '',
    genreId ? 'in selected genre' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section aria-label="Book results">
      {!loading && !error && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
            {totalCount === 0
              ? 'No books found'
              : `Showing ${books.length} of ${totalCount} book${totalCount > 1 ? 's' : ''}${
                  filterDescription ? ` ${filterDescription}` : ''
                }`}
          </p>
        </div>
      )}

      {loading ? (
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-live="polite"
        >
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5"
            >
              <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-3 w-1/3 rounded bg-slate-100 dark:bg-slate-700/50" />
              <div className="mt-6 h-9 w-full rounded bg-slate-100 dark:bg-slate-700/50" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-6 text-center text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-16 text-center">
          <p className="text-base font-semibold text-teal-700 dark:text-teal-400">
            No books found
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {search || genreId
              ? 'Try adjusting your search or filters.'
              : 'The catalog is currently empty.'}
          </p>
          {(search || genreId) && (
            <Link
              to="/"
              className="mt-6 inline-flex rounded-md bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200"
            >
              Clear filters
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}

export default BookGrid;