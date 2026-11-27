
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      addToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-6">
        Manage Space Bookings
      </h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
          <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100">
            <tr>
              <th className="px-4 py-3">Space</th>
              <th className="px-4 py-3">Patron</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b dark:border-slate-700">
                <td className="px-4 py-3 font-medium">{booking.space?.name}</td>
                <td className="px-4 py-3">{booking.user?.name || booking.user?.email}</td>
                <td className="px-4 py-3">
                  {new Date(booking.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {booking.startTime} - {booking.endTime}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBookings;