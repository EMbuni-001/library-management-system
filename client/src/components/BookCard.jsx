
import { Link } from 'react-router-dom';
import AddToReadingListButton from './AddToReadingListButton';

function BookCard({ book }) {
  return (
    // focus-within highlights the whole card when a keyboard user tabs
    // to either button inside it, so the focus location is obvious.
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md focus-within:ring-2 focus-within:ring-teal-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-700">
      <h2 className="text-base font-semibold leading-snug text-teal-700 dark:text-teal-400 sm:text-lg">
        {book.title}
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        by {book.author}
      </p>
      <p className="mt-2 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {book.genre?.name || 'Uncategorised'}
      </p>

      <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
        <Link
          to={`/books/${book.id}`}
          className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-600 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:bg-slate-700 dark:hover:text-teal-300"
        >
          View details
        </Link>
        <AddToReadingListButton book={book} />
      </div>
    </article>
  );
}

export default BookCard;