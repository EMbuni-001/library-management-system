
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';
import AddToReadingListButton from '../components/AddToReadingListButton';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If the visitor clicks between books quickly, this flag lets us
    // ignore the response from the request we no longer care about.
    let active = true;

    async function fetchBook() {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/books/${id}`);

        if (active) {
          setBook(response.data);
        }
      } catch (err) {
        if (active) {
          setError('Could not load this book. It may have been removed.');
          setBook(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchBook();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-8 h-24 w-full rounded bg-slate-100 dark:bg-slate-700/50" />
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-base text-red-600 dark:text-red-400">
          {error || 'Book not found.'}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus-visible:ring-offset-slate-900"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-teal-700 underline-offset-2 transition-colors duration-200 hover:text-teal-800 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
      >
        Back to catalog
      </Link>

      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-teal-700 dark:text-teal-400 sm:text-3xl">
          {book.title}
        </h1>
        <p className="mt-2 text-base text-slate-700 dark:text-slate-300 sm:text-lg">
          by {book.author}
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-y border-slate-100 py-6 dark:border-slate-700 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Genre
            </dt>
            <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
              {book.genre?.name || 'Uncategorised'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              ISBN
            </dt>
            <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
              {book.isbn}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Total copies
            </dt>
            <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
              {book.totalCopies}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Available copies
            </dt>
            <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
              {book.availableCopies}
            </dd>
          </div>
        </dl>

        {book.description && (
          <p className="mt-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
            {book.description}
          </p>
        )}

        <div className="mt-8">
          <AddToReadingListButton book={book} className="w-full sm:w-auto" />
        </div>

        {book.reviews && book.reviews.length > 0 && (
          <section className="mt-10 border-t border-slate-100 pt-6 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-400">
              Reviews
            </h2>
            <ul className="mt-4 space-y-4">
              {book.reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900/40"
                >
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    {review.rating} out of 5
                  </p>
                  {review.comment && (
                    <p className="mt-2 text-sm italic text-slate-700 dark:text-slate-300">
                      {review.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}

export default BookDetail;