
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SPACES = [
  { id: '1', name: 'Room A', detail: '4 seats, whiteboard' },
  { id: '2', name: 'Room B', detail: '6 seats, screen sharing' },
  { id: '3', name: 'Quiet Study Booth 1', detail: '1 seat, silent zone' },
  { id: '4', name: 'Quiet Study Booth 2', detail: '1 seat, silent zone' },
  { id: '5', name: 'Group Discussion Pod', detail: '8 seats, projector' },
];

const MIN_DURATION_MINUTES = 30;
const MAX_DURATION_MINUTES = 300; // 5 hours

function getLocalToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function toMinutes(timeValue) {
  const [hours, minutes] = timeValue.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
}

function formatDateDDMMYYYY(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function SpaceBookingPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [form, setForm] = useState({
    spaceId: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const today = getLocalToday();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: '' });
    setConfirmation(null);
  };

  const validate = () => {
    const errors = {};

    if (!form.spaceId) errors.spaceId = 'Please select a study space.';
    if (!form.date) errors.date = 'Please select a date.';
    if (!form.startTime) errors.startTime = 'Please select a start time.';
    if (!form.endTime) errors.endTime = 'Please select an end time.';

    if (form.date && form.date < today) {
      errors.date = 'You cannot book a space in the past.';
    }

    if (form.startTime && form.endTime) {
      const start = toMinutes(form.startTime);
      const end = toMinutes(form.endTime);

      if (end <= start) {
        errors.endTime = 'End time must be after start time.';
      } else if (end - start < MIN_DURATION_MINUTES) {
        errors.endTime = `Bookings must be at least ${MIN_DURATION_MINUTES} minutes.`;
      } else if (end - start > MAX_DURATION_MINUTES) {
        errors.endTime = `A single booking cannot exceed 5 hours.`;
      }
    }

    if (form.date === today && form.startTime) {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      if (toMinutes(form.startTime) < nowMinutes) {
        errors.startTime = 'That start time has already passed today.';
      }
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      addToast('Please fix the errors in the form', 'error');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const selectedSpace = SPACES.find((space) => space.id === form.spaceId);
      const duration = toMinutes(form.endTime) - toMinutes(form.startTime);

      setConfirmation({
        spaceName: selectedSpace ? selectedSpace.name : 'Study space',
        date: formatDateDDMMYYYY(form.date),
        startTime: form.startTime,
        endTime: form.endTime,
        duration: formatDuration(duration),
      });

      addToast('Booking request captured successfully!', 'success');
      
      setForm({ spaceId: '', date: '', startTime: '', endTime: '' });
      setSubmitting(false);
    }, 600);
  };

  const inputBase = 'w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200';
  const inputNormal = 'border-slate-300 dark:border-slate-600';
  const inputError = 'border-red-400 focus:ring-red-500 dark:border-red-500';

  const getInputClass = (fieldName) => `${inputBase} ${fieldErrors[fieldName] ? inputError : inputNormal}`;

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 transition-colors duration-200">
        <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-2">
          Book a Study Space
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Reserve a room or booth for up to 5 hours. Bookings are confirmed by the library team.
        </p>

        {user && (
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
            Booking as: <span className="font-medium text-teal-700 dark:text-teal-400">{user.name || user.email}</span>
          </p>
        )}

        {confirmation && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-md">
            <h2 className="text-base font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
              Booking Request Captured
            </h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-emerald-900 dark:text-emerald-200">
              <dt className="font-medium">Space:</dt><dd>{confirmation.spaceName}</dd>
              <dt className="font-medium">Date:</dt><dd>{confirmation.date}</dd>
              <dt className="font-medium">Time:</dt><dd>{confirmation.startTime} to {confirmation.endTime}</dd>
              <dt className="font-medium">Duration:</dt><dd>{confirmation.duration}</dd>
            </dl>
          </div>
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
              className={getInputClass('spaceId')}
            >
              <option value="">Select a study space</option>
              {SPACES.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.name} ({space.detail})
                </option>
              ))}
            </select>
            {fieldErrors.spaceId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.spaceId}</p>
            )}
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
              min={today}
              className={getInputClass('date')}
            />
            {fieldErrors.date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.date}</p>
            )}
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
                className={getInputClass('startTime')}
              />
              {fieldErrors.startTime && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.startTime}</p>
              )}
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
                className={getInputClass('endTime')}
              />
              {fieldErrors.endTime && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.endTime}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {submitting ? 'Processing...' : 'Request Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SpaceBookingPage;