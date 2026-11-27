
import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function RequestToBorrowButton({ book, className = '' }) {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  if (!isAuthenticated) {
    return null;
  }

  const handleRequest = async () => {
    if (!book || !book.id) return;

    setLoading(true);
    try {
      await api.post('/borrow-requests', { bookId: book.id });
      setRequested(true);
      addToast(`Request submitted for "${book.title}"`, 'success');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit request';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800';

  const requestedStyles =
    'border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';

  const availableStyles =
    'border-teal-600 bg-teal-600 text-white hover:border-teal-700 hover:bg-teal-700 focus-visible:ring-teal-500 dark:border-teal-500 dark:bg-teal-500 dark:hover:border-teal-600 dark:hover:bg-teal-600';

  const unavailableStyles =
    'border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400';

  const isAvailable = book.availableCopies > 0;
  const buttonStyles = requested
    ? requestedStyles
    : isAvailable
    ? availableStyles
    : unavailableStyles;

  return (
    <button
      type="button"
      onClick={handleRequest}
      disabled={loading || requested || !isAvailable}
      aria-label={
        requested
          ? `Request already submitted for ${book.title}`
          : `Request to borrow ${book.title}`
      }
      className={`${base} ${buttonStyles} ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Submitting...
        </>
      ) : requested ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Requested
        </>
      ) : isAvailable ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
          Request to Borrow
        </>
      ) : (
        'Unavailable'
      )}
    </button>
  );
}

export default RequestToBorrowButton;