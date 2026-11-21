
import { Component } from 'react';
import { Link } from 'react-router-dom';

// Error boundaries must be class components — React's design requires this
// because they use lifecycle methods (componentDidCatch) that don't exist
// in function components yet.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // React calls this when a child component throws during rendering
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // This logs the error for debugging (in production, you'd send it to a service)
  componentDidCatch(error, errorInfo) {
    // Intentionally not using console.log in production builds
    // but keeping this hook for future error tracking integration
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors duration-200">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-4">
              Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We encountered an unexpected error. You can try again or return to the home page.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Try again
              </button>
              <Link
                to="/"
                className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;