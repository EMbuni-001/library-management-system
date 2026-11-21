
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReadingList } from '../context/ReadingListContext';

function ReadingListPage() {
  const { readingList, removeBook, clearList } = useReadingList();
  const { isAuthenticated } = useAuth();
  const [confirmingClear, setConfirmingClear] = useState(false);

  function handleClear() {
    clearList();
    setConfirmingClear(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 print:px-0 print:py-0">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 sm:text-3xl print:text-black">
            Your reading list
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base print:text-slate-700">
            {readingList.length === 0
              ? 'Nothing saved yet.'
              : `${readingList.length} book${readingList.length > 1 ? 's' : ''} saved.`}
          </p>
        </div>

        {readingList.length > 0 && (
          <div className="flex flex-wrap gap-3 print:hidden">
            {confirmingClear ? (
              <>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-md bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200"
                >
                  Yes, clear all
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingClear(false)}
                  className="rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingClear(true)}
                className="rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300 transition-colors duration-200"
              >
                Clear list
              </button>
            )}
          </div>
        )}
      </header>

      {!isAuthenticated && readingList.length > 0 && (
        <div className="mb-8 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-200 print:hidden">
          This list is saved on this device only.{' '}
          <Link
            to="/login"
            className="font-medium underline underline-offset-2 hover:text-teal-700 dark:hover:text-teal-100"
          >
            Log in
          </Link>{' '}
          to sync it across devices.
        </div>
      )}

      {readingList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-16 text-center print:border-solid print:border-black">
          <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-400 print:text-black">
            Your list is empty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">
            Browse the catalog and use the add button on any book to save it here.
            Your list survives a page refresh.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-md bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 print:bg-black print:text-white"
          >
            Browse the catalog
          </Link>
        </div>
      ) : (
        <ul className="space-y-4 print:space-y-2">
          {readingList.map((book) => (
            <li
              key={book.id}
              className="flex flex-col gap-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between print:border-b print:border-slate-300 print:shadow-none print:p-3"
            >
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-semibold text-teal-700 dark:text-teal-400 print:text-black">
                  {book.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">
                  by {book.author}
                </p>
                {book.genreName && (
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 print:text-slate-600">
                    {book.genreName}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 print:hidden">
                <Link
                  to={`/books/${book.id}`}
                  className="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800 dark:hover:border-teal-500 dark:hover:bg-slate-700 dark:hover:text-teal-300 transition-colors duration-200"
                >
                  View details
                </Link>
                <button
                  type="button"
                  onClick={() => removeBook(book.id)}
                  aria-label={`Remove ${book.title} from your reading list`}
                  className="rounded-md border border-red-200 dark:border-red-800 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {readingList.length > 0 && (
        <div className="mt-8 flex flex-col gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-5 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Ready to reserve somewhere to read?
          </p>
          <Link
            to="/bookings"
            className="rounded-md bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-200"
          >
            Book a study space
          </Link>
        </div>
      )}

      {readingList.length > 0 && (
        <div className="mt-6 text-center print:block hidden">
          <p className="text-xs text-slate-500">
            Generated on {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>
      )}
    </div>
  );
}

export default ReadingListPage;