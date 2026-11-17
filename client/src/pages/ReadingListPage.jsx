
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext';
import { useAuth } from '../context/AuthContext';

function ReadingListPage() {
  const { readingList, removeBook, clearList } = useReadingList();
  const { isAuthenticated } = useAuth();
  const [confirmingClear, setConfirmingClear] = useState(false);

  function handleClear() {
    clearList();
    setConfirmingClear(false);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Your reading list
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            {readingList.length === 0
              ? 'Nothing saved yet.'
              : `${readingList.length} book${
                  readingList.length > 1 ? 's' : ''
                } saved on this device.`}
          </p>
        </div>

        {readingList.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {confirmingClear ? (
              <>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                >
                  Yes, clear all
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingClear(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingClear(true)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                Clear list
              </button>
            )}
          </div>
        )}
      </header>

      {!isAuthenticated && readingList.length > 0 && (
        <div className="mb-8 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          This list is saved on this device only.{' '}
          <Link
            to="/login"
            className="font-medium underline underline-offset-2 transition-colors duration-200 hover:text-indigo-700"
          >
            Log in
          </Link>{' '}
          and it will be merged into your account.
        </div>
      )}

      {readingList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-medium text-slate-900">
            Your list is empty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Browse the catalog and use the add button on any book to keep it
            here. Your list survives a page refresh.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            Browse the catalog
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {readingList.map((book) => (
            <li
              key={book.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-slate-900">
                  {book.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">by {book.author}</p>
                {book.genreName && (
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                    {book.genreName}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/books/${book.id}`}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  View details
                </Link>
                <button
                  type="button"
                  onClick={() => removeBook(book.id)}
                  aria-label={`Remove ${book.title} from your reading list`}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition-colors duration-200 hover:border-red-300 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {readingList.length > 0 && (
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm text-slate-700">
            Ready to reserve somewhere to read?
          </p>
          <Link
            to="/bookings"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          >
            Book a study space
          </Link>
        </div>
      )}
    </div>
  );
}

export default ReadingListPage;