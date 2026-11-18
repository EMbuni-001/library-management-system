
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { email: '', password: '' };

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from || '/';

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: '' }));
    setServerError('');
  }

  function validate() {
    const errors = {};
    const email = form.email.trim();

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      errors.password = 'Password is required.';
    }

    return errors;
  }

  async function handleSubmit(event) {
    // Without this the browser reloads the page and discards all
    // React state, including the reading list held in memory.
    event.preventDefault();

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    setServerError('');

    const result = await login(form);

    setSubmitting(false);

    if (result.ok) {
      setForm(EMPTY_FORM);
      navigate(redirectTo, { replace: true });
    } else {
      setServerError(result.message);
    }
  }

  const inputBase =
    'w-full rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder-slate-400 transition-colors duration-200 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-100';
  const inputNormal =
    'border-slate-300 hover:border-teal-400 focus:border-teal-500 focus:ring-teal-200 dark:border-slate-600 dark:hover:border-teal-500 dark:focus:ring-teal-800';
  const inputError =
    'border-red-400 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900';

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-teal-700 dark:text-teal-400 sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Log in to book study spaces and keep your reading list.
        </p>

        {serverError && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className={`mt-1 ${inputBase} ${
                fieldErrors.email ? inputError : inputNormal
              }`}
            />
            {fieldErrors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? 'password-error' : undefined
                }
                className={`${inputBase} pr-20 ${
                  fieldErrors.password ? inputError : inputNormal
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-slate-500 transition-colors duration-200 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-400 dark:hover:text-teal-300"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {fieldErrors.password && (
              <p
                id="password-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-teal-300 dark:bg-teal-500 dark:hover:bg-teal-600 dark:disabled:bg-teal-800 dark:focus-visible:ring-offset-slate-800"
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          No account yet?{' '}
          <Link
            to="/register"
            className="font-medium text-teal-700 underline-offset-2 transition-colors duration-200 hover:text-teal-800 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;