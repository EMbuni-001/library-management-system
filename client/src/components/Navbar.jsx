
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { readingList } = useReadingList();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

  function handleLogout() {
    setDropdownOpen(false);
    logout();
    navigate('/', { replace: true });
  }

  function getFirstName() {
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Member';
  }

  function linkClasses({ isActive }) {
    const base =
      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500';
    const active = 'bg-teal-600 text-white dark:bg-teal-500';
    const inactive =
      'text-slate-600 hover:bg-teal-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-teal-300';
    return `${base} ${isActive ? active : inactive}`;
  }

  const themeButtonClasses =
    'rounded-lg border border-slate-300 p-2 text-slate-700 transition-colors duration-200 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-600 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:bg-slate-700 dark:hover:text-teal-300';

  const navLinks = (
    <>
      <NavLink to="/" className={linkClasses} end>
        Catalog
      </NavLink>
      <NavLink to="/reading-list" className={linkClasses}>
        <span className="flex items-center gap-2">
          Reading list
          <span
            aria-label={`${readingList.length} books in your reading list`}
            className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-teal-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-teal-500"
          >
            {readingList.length}
          </span>
        </span>
      </NavLink>
      {isAuthenticated && (
        <>
          <NavLink to="/my-borrows" className={linkClasses}>
            My Borrows
          </NavLink>
          <NavLink to="/my-bookings" className={linkClasses}>
            My Bookings
          </NavLink>
        </>
      )}
      <NavLink to="/bookings" className={linkClasses}>
        Book a space
      </NavLink>
      {isAuthenticated && user?.role === 'LIBRARIAN' && (
        <NavLink to="/admin/dashboard" className={linkClasses}>
          Admin
        </NavLink>
      )}
    </>
  );

  const desktopAuthControls = isAuthenticated ? (
    <div className="flex items-center gap-3">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((open) => !open)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm transition-colors duration-200 hover:border-teal-400 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-600 dark:hover:border-teal-500 dark:hover:bg-slate-700"
        >
          {user?.role === 'LIBRARIAN' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-teal-600 dark:text-teal-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-slate-600 dark:text-slate-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span className="text-slate-700 dark:text-slate-200">
            {getFirstName()}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div
            role="menu"
            className="absolute right-0 z-40 mt-2 w-64 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="border-b border-slate-100 p-4 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user?.name || 'Member'}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.email}
              </p>
              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  user?.role === 'LIBRARIAN'
                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {user?.role === 'LIBRARIAN' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {user?.role === 'LIBRARIAN' ? 'Librarian' : 'Patron'}
              </span>
            </div>
            <div className="p-1">
              <NavLink
                to="/my-borrows"
                role="menuitem"
                className="block rounded-md px-3 py-2 text-sm text-slate-700 transition-colors duration-200 hover:bg-teal-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-teal-300"
              >
                My Borrows
              </NavLink>
              <NavLink
                to="/my-bookings"
                role="menuitem"
                className="block rounded-md px-3 py-2 text-sm text-slate-700 transition-colors duration-200 hover:bg-teal-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-teal-300"
              >
                My Bookings
              </NavLink>
            </div>
            <div className="border-t border-slate-100 p-1 dark:border-slate-700">
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 transition-colors duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Link
        to="/login"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-teal-300"
      >
        Log in
      </Link>
      <Link
        to="/register"
        className="rounded-lg bg-teal-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus-visible:ring-offset-slate-800"
      >
        Register
      </Link>
    </div>
  );

  const mobileAuthControls = isAuthenticated ? (
    <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
      <div className="mb-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {user?.name || 'Member'}
        </p>
        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
          {user?.email}
        </p>
        <span
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            user?.role === 'LIBRARIAN'
              ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
          }`}
        >
          {user?.role === 'LIBRARIAN' ? 'Librarian' : 'Patron'}
        </span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        Log out
      </button>
    </div>
  ) : (
    <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
      <Link
        to="/login"
        className="rounded-lg px-3 py-2 text-center text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-teal-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-teal-300"
      >
        Log in
      </Link>
      <Link
        to="/register"
        className="rounded-lg bg-teal-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
      >
        Register
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="text-base font-semibold tracking-tight text-teal-700 transition-colors duration-200 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 sm:text-lg"
        >
          Library Management
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks}
        </nav>
        <div className="hidden md:flex md:items-center md:gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className={themeButtonClasses}
          >
            {theme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          {desktopAuthControls}
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 transition-colors duration-200 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 md:hidden"
        >
          <span className="block h-4 w-5 space-y-1" aria-hidden="true">
            <span className="block h-0.5 w-full bg-current" />
            <span className="block h-0.5 w-full bg-current" />
            <span className="block h-0.5 w-full bg-current" />
          </span>
        </button>
      </div>
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-200 bg-white px-4 py-3 transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks}
          </nav>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-700">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="flex flex-1 items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-sm transition-colors duration-200 hover:border-teal-400 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-600 dark:hover:border-teal-500 dark:hover:bg-slate-700"
            >
              <span className="text-slate-700 dark:text-slate-300">
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </span>
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-amber-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
          {mobileAuthControls}
        </div>
      )}
    </header>
  );
}

export default Navbar;