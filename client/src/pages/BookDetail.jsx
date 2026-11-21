
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';
import AddToReadingListButton from '../components/AddToReadingListButton';
import Breadcrumb from '../components/Breadcrumb';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

function renderStars(rating) {
  const stars = [];
  const numericRating = Number(rating) || 0;

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`text-lg ${
          i <= numericRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
        }`}
        aria-hidden="true"
      >
        ★
      </span>
    );
  }
  return stars;
}

function BookDetail() {
  const { id } = useParams();
  const { addRecentlyViewed } = useRecentlyViewed();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchBook() {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/books/${id}`);

        if (active) {
          setBook(response.data);
          // Track this book as recently viewed
          addRecentlyViewed({
            id: response.data.id,
            title: response.data.title,
            author: response.data.author,
            coverImage: response.data.coverImage,
          });
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
  }, [id, addRecentlyViewed]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-4 h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="animate-pulse rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
          <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-8 h-24 w-full rounded bg-slate-100 dark:bg-slate-700/50" />
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-base text-red-600 dark:text-red-400">
          {error || 'Book not found.'}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Catalog', href: '/' },
          { label: book.title },
        ]}
      />

      <article className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm transition-colors duration-200">
        <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 sm:text-3xl">
          {book.title}
        </h1>
        <p className="mt-2 text-base text-slate-700 dark:text-slate-300 sm:text-lg">
          by {book.author}
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-y border-slate-100 dark:border-slate-700 py-6 sm:grid-cols-2">
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

        {book.reviews && book.reviews.length > 0 ? (
          <section className="mt-10 border-t border-slate-100 dark:border-slate-700 pt-6">
            <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-400">
              Reviews
            </h2>
            <ul className="mt-4 space-y-4">
              {book.reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-md border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      ({review.rating}/5)
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm italic text-slate-700 dark:text-slate-300">
                      "{review.comment}"
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section className="mt-10 border-t border-slate-100 dark:border-slate-700 pt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </section>
        )}
      </article>
    </div>
  );
}

export default BookDetail;