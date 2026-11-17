
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReadingListProvider } from './context/ReadingListContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BookDetail from './pages/BookDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReadingListPage from './pages/ReadingListPage';
import SpaceBookingPage from './pages/SpaceBookingPage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ReadingListProvider>
            <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/books/:id" element={<BookDetail />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/reading-list" element={<ReadingListPage />} />
                  <Route
                    path="/bookings"
                    element={
                      <ProtectedRoute>
                        <SpaceBookingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <div className="mx-auto max-w-md px-4 py-20 text-center">
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          Page not found
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          The page you asked for does not exist.
                        </p>
                      </div>
                    }
                  />
                </Routes>
              </main>

              <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-6 transition-colors duration-200">
                <p className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-500 dark:text-slate-400 sm:px-6">
                  Library Management System. Catalog, reading lists and study space bookings.
                </p>
              </footer>
            </div>
          </ReadingListProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;