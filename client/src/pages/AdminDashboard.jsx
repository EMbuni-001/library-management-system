
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function StatCard({ title, value, subtitle, accent = 'teal' }) {
  const accentClasses = {
    teal: 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-900/20',
    emerald: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20',
    amber: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
    red: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
    indigo: 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20',
    slate: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50',
  };
  const textClasses = {
    teal: 'text-teal-700 dark:text-teal-400',
    emerald: 'text-emerald-700 dark:text-emerald-400',
    amber: 'text-amber-700 dark:text-amber-400',
    red: 'text-red-700 dark:text-red-400',
    indigo: 'text-indigo-700 dark:text-indigo-400',
    slate: 'text-slate-700 dark:text-slate-300',
  };

  return (
    <div className={`rounded-lg border p-5 ${accentClasses[accent]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className={`mt-2 text-3xl font-bold ${textClasses[accent]}`}>
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics.');
      addToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Failed to load dashboard.'}</p>
        <button
          onClick={fetchStats}
          className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Overview of library activity and key metrics.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Catalog & Members
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Books"
            value={stats.books.total}
            subtitle="In the catalog"
            accent="teal"
          />
          <StatCard
            title="Total Members"
            value={stats.users.total}
            subtitle="Registered users"
            accent="indigo"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Borrow Requests
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={stats.borrowRequests.total}
            subtitle="All time"
            accent="slate"
          />
          <StatCard
            title="Pending"
            value={stats.borrowRequests.pending}
            subtitle="Awaiting review"
            accent="amber"
          />
          <StatCard
            title="Approved"
            value={stats.borrowRequests.approved}
            subtitle="Currently borrowed"
            accent="emerald"
          />
          <StatCard
            title="Overdue"
            value={stats.borrowRequests.overdue}
            subtitle="Requires attention"
            accent="red"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Space Bookings
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={stats.bookings.total}
            subtitle="All time"
            accent="slate"
          />
          <StatCard
            title="Confirmed"
            value={stats.bookings.confirmed}
            subtitle="Active bookings"
            accent="emerald"
          />
          <StatCard
            title="Upcoming"
            value={stats.bookings.upcoming}
            subtitle="From today onwards"
            accent="teal"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Revenue
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Fines Collected"
            value={`$${(stats.fines.totalCollected || 0).toFixed(2)}`}
            subtitle="From overdue returns"
            accent="amber"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/borrow-requests"
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-500"
          >
            <h3 className="text-base font-semibold text-teal-700 dark:text-teal-400">
              Manage Borrow Requests
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Review, approve, and process book borrow requests.
            </p>
            <p className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400">
              {stats.borrowRequests.pending} pending
            </p>
          </Link>
          <Link
            to="/admin/bookings"
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-500"
          >
            <h3 className="text-base font-semibold text-teal-700 dark:text-teal-400">
              Manage Bookings
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              View and manage study space reservations.
            </p>
            <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {stats.bookings.confirmed} confirmed
            </p>
          </Link>
          <Link
            to="/"
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-500"
          >
            <h3 className="text-base font-semibold text-teal-700 dark:text-teal-400">
              Browse Catalog
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              View the full book collection.
            </p>
            <p className="mt-3 text-xs font-medium text-teal-600 dark:text-teal-400">
              {stats.books.total} books
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;