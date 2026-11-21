
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function SpaceBookingPage() {
  const [form, setForm] = useState({
    spaceId: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  const { user } = useAuth();
  const { addToast } = useToast();

  // One shared handler for all fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form.spaceId || !form.date || !form.startTime || !form.endTime) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    console.log('Booking submitted:', form);
    addToast('Booking request submitted successfully!', 'success');

    // Reset form
    setForm({ spaceId: '', date: '', startTime: '', endTime: '' });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 transition-colors duration-200">
        <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-6">
          Book a Study Space
        </h1>

        {user && (
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Booking as: <span className="font-medium">{user.name || user.email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="spaceId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Study Space
            </label>
            <select
              id="spaceId"
              name="spaceId"
              value={form.spaceId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
            >
              <option value="">Select a study space</option>
              <option value="1">Room A (4 seats)</option>
              <option value="2">Room B (6 seats)</option>
              <option value="3">Quiet Study Booth 1</option>
              <option value="4">Quiet Study Booth 2</option>
              <option value="5">Group Discussion Pod (8 seats)</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Request Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default SpaceBookingPage;