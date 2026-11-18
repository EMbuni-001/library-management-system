
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const MIN_PASSWORD_LENGTH = 8;

function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: '' }));
    setServerError('');
  }

  function validate() {
    const errors = {};
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      errors.name = 'Your name is required.';
    } else if (name.length < 2) {
      errors.name = 'Please enter at least 2 characters.';
    }

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      errors.password = 'Password is required.';
    } else if (form.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (form.confirmPassword !== form.password) {
      errors.confirmPassword = 'The two passwords do not match.';
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    setServerError('');

    // confirmPassword is a screen-only check, so it is deliberately
    // left out of the request body.
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    setSubmitting(false);

    if (result.ok) {
      setForm(EMPTY_FORM);
      navigate('/', { replace: true });
      return;
    }

    setServerError(result.message);

    if (result.redirectToLogin) {
      navigate('/login', { replace: true });
    }
  }

  const inputBase =
    'w-full rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder-slate-400 transition-colors duration-200 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-100';
  const inputNormal =
    'border-slate-300 hover:border-teal-400 focus:border-teal-500 focus:ring-teal-200 dark:border-slate-600 dark:hover:border-teal-500 dark:focus:ring-teal-800';
  const inputError =
    'border-red-400 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900';

  function inputClass(fieldName) {
    return `${inputBase} ${fieldErrors[fieldName] ? inputError : inputNormal}`;
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-teal-700 dark:text-teal-400 sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Membership lets you request loans and reserve study spaces.
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
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              className={`mt-1 ${inputClass('name')}`}
            />
            {fieldErrors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {fieldErrors.name}
              </p>
            )}
          </div>

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
              className={`mt-1 ${inputClass('email')}`}
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
                autoComplete="new-password"
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                value={form.password}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? 'password-error' : 'password-hint'
                }
                className={`${inputClass('password')} pr-20`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-slate-500 transition-colors duration-200 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-400 dark:hover:text-teal-300"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {fieldErrors.password ? (
              <p
                id="password-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {fieldErrors.password}
              </p>
            ) : (
              <p
                id="password-hint"
                className="mt-1 text-xs text-slate-500 dark:text-slate-400"
              >
                Use at least {MIN_PASSWORD_LENGTH} characters.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={
                fieldErrors.confirmPassword ? 'confirm-error' : undefined
              }
              className={`mt-1 ${inputClass('confirmPassword')}`}
            />
            {fieldErrors.confirmPassword && (
              <p
                id="confirm-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-teal-300 dark:bg-teal-500 dark:hover:bg-teal-600 dark:disabled:bg-teal-800 dark:focus-visible:ring-offset-slate-800"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already a member?{' '}
          <Link
            to="/login"
            className="font-medium text-teal-700 underline-offset-2 transition-colors duration-200 hover:text-teal-800 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;