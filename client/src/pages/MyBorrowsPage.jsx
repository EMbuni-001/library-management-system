
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function MyBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const response = await api.get('/borrow-requests/my');
      setBorrows(response.data);
    } catch (err) {
      setError('Could not load your borrow history.');
      addToast('Failed to load borrow history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      REQUESTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      APPROVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      BORROWED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      RETURNED: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
      OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      CANCELLED: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    };
    return colors[status] || colors.REQUESTED;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchBorrows}
          className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 sm:text-3xl">
          My Borrows
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Track your borrow requests and returns.
        </p>
      </header>

      {borrows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-400">
            No borrow history yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Browse the catalog and request to borrow books. Your borrow history will appear here.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-md bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {borrows.map((borrow) => (
            <div
              key={borrow.id}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors duration-200"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-teal-700 dark:text-teal-400">
                    {borrow.bookTitle}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    by {borrow.bookAuthor}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Requested:</span>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {formatDate(borrow.requestDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Due Date:</span>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {formatDate(borrow.dueDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Returned:</span>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {formatDate(borrow.returnDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Fine:</span>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        ${borrow.fineAmount?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sm:ml-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(borrow.status)}`}>
                    {borrow.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBorrowsPage;