
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SPACES = [
  { id: '1', name: 'Room A', detail: '4 seats, whiteboard' },
  { id: '2', name: 'Room B', detail: '6 seats, screen sharing' },
  { id: '3', name: 'Quiet Study Booth 1', detail: '1 seat, silent zone' },
  { id: '4', name: 'Quiet Study Booth 2', detail: '1 seat, silent zone' },
  { id: '5', name: 'Group Discussion Pod', detail: '8 seats, projector' },
];

const EMPTY_FORM = { spaceId: '', date: '', startTime: '', endTime: '' };
const MIN_DURATION_MINUTES = 30;
const MAX_DURATION_MINUTES = 240;

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

function SpaceBookingPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const today = getLocalToday();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: '' }));
    setConfirmation(null);
  }

  function validate() {
    const errors = {};
    if (!form.spaceId) errors.spaceId = 'Choose a study space.';
    if (!form.date) {
      errors.date = 'Choose a date.';
    } else if (form.date < today) {
      errors.date = 'The date cannot be in the past.';
    }
    if (!form.startTime) errors.startTime = 'Choose a start time.';
    if (!form.endTime) errors.endTime = 'Choose an end time.';

    if (form.startTime && form.endTime) {
      const start = toMinutes(form.startTime);
      const end = toMinutes(form.endTime);
      if (end <= start) {
        errors.endTime = 'The end time must be after the start time.';
      } else if (end - start < MIN_DURATION_MINUTES) {
        errors.endTime = `Book at least ${MIN_DURATION_MINUTES} minutes.`;
      } else if (end - start > MAX_DURATION_MINUTES) {
        errors.endTime = 'A single booking cannot exceed 4 hours.';
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
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const selectedSpace = SPACES.find((space) => space.id === form.spaceId);
    const duration = toMinutes(form.endTime) - toMinutes(form.startTime);

    setConfirmation({
      spaceName: selectedSpace ? selectedSpace.name : 'Study space',
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      duration: formatDuration(duration),
    });

    addToast('Booking request captured successfully!', 'success');
    setForm(EMPTY_FORM);
    setSubmitting(false);
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setConfirmation(null);
  }

  const inputBase = 'w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2';
  const inputNormal = 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800';
  const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-200';

  function inputClass(fieldName) {
    return `${inputBase} ${fieldErrors[fieldName] ? inputError : inputNormal}`;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Book a study space
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          Reserve a room or booth for up to four hours. Bookings are confirmed by the library team.
        </p>
        {user?.name && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Booking as {user.name}.
          </p>
        )}
      </header>

      {confirmation && (
        <div role="status" className="mb-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5 sm:p-6 transition-colors duration-200">
          <h2 className="text-base font-semibold text-emerald-900 dark:text-emerald-200">
            Booking request captured
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-emerald-900 dark:text-emerald-200 sm:grid-cols-2">
            <div>
              <dt className="font-medium">Space</dt>
              <dd>{confirmation.spaceName}</dd>
            </div>
            <div>
              <dt className="font-medium">Date</dt>
              <dd>{confirmation.date}</dd>
            </div>
            <div>
              <dt className="font-medium">Time</dt>
              <dd>{confirmation.startTime} to {confirmation.endTime}</dd>
            </div>
            <div>
              <dt className="font-medium">Duration</dt>
              <dd>{confirmation.duration}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-emerald-800 dark:text-emerald-300">
            This form is not yet connected to the server. Booking storage and clash detection are added next week.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm sm:p-8 transition-colors duration-200">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="spaceId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Study space
            </label>
            <select
              id="spaceId"
              name="spaceId"
              value={form.spaceId}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.spaceId)}
              aria-describedby={fieldErrors.spaceId ? 'spaceId-error' : undefined}
              className={`mt-1 ${inputClass('spaceId')}`}
            >
              <option value="">Select a study space</option>
              {SPACES.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.name} ({space.detail})
                </option>
              ))}
            </select>
            {fieldErrors.spaceId && (
              <p id="spaceId-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.spaceId}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              min={today}
              value={form.date}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.date)}
              aria-describedby={fieldErrors.date ? 'date-error' : undefined}
              className={`mt-1 ${inputClass('date')}`}
            />
            {fieldErrors.date && (
              <p id="date-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.date}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Start time
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                step="900"
                value={form.startTime}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.startTime)}
                aria-describedby={fieldErrors.startTime ? 'startTime-error' : undefined}
                className={`mt-1 ${inputClass('startTime')}`}
              />
              {fieldErrors.startTime && (
                <p id="startTime-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.startTime}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                End time
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                step="900"
                value={form.endTime}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.endTime)}
                aria-describedby={fieldErrors.endTime ? 'endTime-error' : undefined}
                className={`mt-1 ${inputClass('endTime')}`}
              />
              {fieldErrors.endTime && (
                <p id="endTime-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.endTime}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 dark:border-slate-700 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Minimum 30 minutes, maximum 4 hours.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-200 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Clear form
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                {submitting ? 'Preparing...' : 'Request booking'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
        Looking for something to read while you are here?{' '}
        <Link to="/" className="font-medium text-indigo-600 dark:text-indigo-400 underline-offset-2 transition-colors duration-200 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline">
          Browse the catalog
        </Link>
      </p>
    </div>
  );
}

export default SpaceBookingPage;