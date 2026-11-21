
import { createContext, useContext, useEffect, useReducer } from 'react';

const RecentlyViewedContext = createContext(null);

const STORAGE_KEY = 'library-recently-viewed';
const MAX_ITEMS = 5;

// Reducer keeps recently viewed books in a predictable state
function recentlyViewedReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK': {
      const book = action.payload;
      if (!book || book.id === undefined) return state;

      // Remove if already in list (to move it to the top)
      const filtered = state.filter((b) => b.id !== book.id);

      // Add to the front and cap at MAX_ITEMS
      return [book, ...filtered].slice(0, MAX_ITEMS);
    }
    case 'CLEAR':
      return [];
    case 'SET':
      return Array.isArray(action.payload) ? action.payload : [];
    default:
      return state;
  }
}

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, dispatch] = useReducer(recentlyViewedReducer, [], () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch (error) {
      // Storage might be full or unavailable
    }
  }, [recentlyViewed]);

  const value = {
    recentlyViewed,
    addRecentlyViewed: (book) => dispatch({ type: 'ADD_BOOK', payload: book }),
    clearRecentlyViewed: () => dispatch({ type: 'CLEAR' }),
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === null) {
    throw new Error('useRecentlyViewed must be used inside a RecentlyViewedProvider.');
  }
  return context;
}