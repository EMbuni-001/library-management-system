
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ReadingListProvider } from './context/ReadingListContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import ErrorBoundary from './components/ErrorBoundary';
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
        <ErrorBoundary>
          <AuthProvider>
            <ReadingListProvider>
              <RecentlyViewedProvider>
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
                >
                  Skip to main content
                </a>
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
                  <Navbar />
                  <main id="main-content" className="container mx-auto px-4 py-8">
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
                          <div className="text-center py-16">
                            <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-2">
                              Page not found
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                              The page you're looking for doesn't exist.
                            </p>
                            <a
                              href="/"
                              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 inline-block"
                            >
                              Return home
                            </a>
                          </div>
                        }
                      />
                    </Routes>
                  </main>
                </div>
              </RecentlyViewedProvider>
            </ReadingListProvider>
          </AuthProvider>
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;