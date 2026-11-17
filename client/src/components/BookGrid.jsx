
import { useEffect, useState } from 'react';
import api from '../utils/api';
import BookCard from './BookCard';

function BookGrid({ genreId, search, sortBy }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchBooks() {
      setLoading(true);
      setError(null);

      try {
        const params = { limit: 50 };
        if (genreId) params.genreId = genreId;
        if (search) params.search = search;

        const response = await api.get('/books', { params });
        const payload = response.data?.data ?? response.data;
        const list = Array.isArray(payload) ? [...payload] : [];

        if (sortBy === 'title') {
          list.sort((a, b) => String(a.title).localeCompare(String(b.title)));
        } else if (sortBy === 'author') {
          list.sort((a, b) => String(a.author).localeCompare(String(b.author)));
        }

        if (active) setBooks(list);
      } catch (err) {
        if (active) {
          setError('Could not load books right now. Please try again shortly.');
          setBooks([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchBooks();
    return () => { active = false; };
  }, [genreId, search, sortBy]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 h-3 w-1/3 rounded bg-slate-100 dark:bg-slate-700/50" />
            <div className="mt-6 h-9 w-full rounded bg-slate-100 dark:bg-slate-700/50" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-6 text-center text-sm text-red-700 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-16 text-center">
        <p className="text-base font-medium text-slate-900 dark:text-slate-100">No books found</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Try a different search term or choose another genre.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;