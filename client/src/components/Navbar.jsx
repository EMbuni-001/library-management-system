
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReadingList } from '../context/ReadingListContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { readingList } = useReadingList();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Leaving the menu open across navigation would cover the page the
  // visitor just opened, so close it whenever the path changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
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

      <NavLink to="/bookings" className={linkClasses}>
        Book a space
      </NavLink>
    </>
  );

  const authControls = isAuthenticated ? (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="px-1 text-sm text-slate-500 dark:text-slate-400">
        {user?.name || user?.email || 'Member'}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-600 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:bg-slate-700 dark:hover:text-teal-300"
      >
        Log out
      </button>
    </div>
  ) : (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
          {authControls}
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
              className={`${themeButtonClasses} text-sm`}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            {authControls}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;