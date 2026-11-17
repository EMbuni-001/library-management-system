
import { Link } from 'react-router-dom';
import AddToReadingListButton from './AddToReadingListButton';

function BookCard({ book }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 sm:text-lg">
        {book.title}
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">by {book.author}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {book.genre?.name || 'Uncategorised'}
      </p>

      <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 dark:border-slate-700 pt-4">
        <Link
          to={`/books/${book.id}`}
          className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-200 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          View details
        </Link>
        <AddToReadingListButton book={book} />
      </div>
    </article>
  );
}

export default BookCard;