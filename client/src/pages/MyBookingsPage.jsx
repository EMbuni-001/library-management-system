
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my');
      setBookings(response.data);
    } catch (err) {
      setError('Could not load your booking history.');
      addToast('Failed to load booking history', 'error');
    } finally {
      setLoading(false);
    }
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
          onClick={fetchBookings}
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
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          View your study space reservations.
        </p>
      </header>

      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-400">
            No bookings yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Reserve a study space for your next visit. Your booking history will appear here.
          </p>
          <Link
            to="/bookings"
            className="mt-6 inline-flex rounded-md bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200"
          >
            Book a Space
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors duration-200"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-teal-700 dark:text-teal-400">
                    {booking.space?.name || 'Study Space'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {booking.space?.detail || ''}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Date:</span>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {formatDate(booking.date)}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Time:</span>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Booked:</span>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sm:ml-4">
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {booking.status}
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

export default MyBookingsPage;