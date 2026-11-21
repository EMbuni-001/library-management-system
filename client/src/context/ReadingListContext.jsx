
import { createContext, useContext, useEffect, useReducer } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import api from '../utils/api';

const ReadingListContext = createContext();

const STORAGE_KEY = 'library-reading-list';

// Reducer handles all state changes in one predictable place
function readingListReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK':
      // Prevent duplicate books in the list
      if (state.some((book) => book.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];

    case 'REMOVE_BOOK':
      return state.filter((book) => book.id !== action.payload);

    case 'CLEAR_LIST':
      return [];

    case 'SET_LIST':
      return Array.isArray(action.payload) ? action.payload : [];

    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const { user, token } = useAuth();
  const { addToast } = useToast();

  // Initialize from localStorage on first render
  const [readingList, dispatch] = useReducer(readingListReducer, [], () => {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readingList));
    } catch (error) {
      // Storage might be full or unavailable
    }
  }, [readingList]);

  // Sync to backend when user is logged in (best-effort, non-blocking)
  // This is an enhancement — localStorage remains the source of truth
  useEffect(() => {
    if (!token || !user?.id) return;

    // On login, try to merge backend list into localStorage
    // so the user's saved books appear on all devices
    let active = true;

    api
      .get('/reading-list')
      .then((response) => {
        if (!active) return;
        const backendBooks = Array.isArray(response.data) ? response.data : [];

        // Normalize backend response to match our localStorage shape
        const normalized = backendBooks.map((item) => {
          const book = item.book || item;
          return {
            id: book.id,
            title: book.title,
            author: book.author,
            coverImage: book.coverImage || null,
            genreName: book.genre?.name || book.genreName || null,
          };
        });

        // Merge: keep existing local books, add any new ones from backend
        dispatch({
          type: 'SET_LIST',
          payload: mergeLists(readingList, normalized),
        });
      })
      .catch(() => {
        // Silently fall back to localStorage — this is not a fatal error
      });

    return () => {
      active = false;
    };
    // Only run this on login (when token changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Helper: merge two lists without duplicates, preserving local order first
  function mergeLists(localList, backendList) {
    const seen = new Set();
    const merged = [];

    // Local books take priority
    for (const book of localList) {
      if (!seen.has(book.id)) {
        seen.add(book.id);
        merged.push(book);
      }
    }

    // Add backend books that aren't already in local list
    for (const book of backendList) {
      if (!seen.has(book.id)) {
        seen.add(book.id);
        merged.push(book);
      }
    }

    return merged;
  }

  const value = {
    readingList,
    count: readingList.length,
    dispatch,
    addBook: (book) => {
      // Update localStorage immediately (source of truth)
      dispatch({ type: 'ADD_BOOK', payload: book });
      addToast(`"${book.title}" added to reading list`, 'success');

      // Best-effort sync to backend if logged in
      if (token && user?.id) {
        api.post('/reading-list', { bookId: book.id }).catch(() => {
          // Silently fail — localStorage is still correct
        });
      }
    },
    removeBook: (bookId) => {
      dispatch({ type: 'REMOVE_BOOK', payload: bookId });
      addToast('Book removed from reading list', 'info');

      if (token && user?.id) {
        api.delete(`/reading-list/${bookId}`).catch(() => {
          // Silently fail
        });
      }
    },
    clearList: () => {
      dispatch({ type: 'CLEAR_LIST' });
      addToast('Reading list cleared', 'info');

      if (token && user?.id) {
        api.delete('/reading-list').catch(() => {
          // Silently fail
        });
      }
    },
    isInList: (bookId) => readingList.some((book) => book.id === bookId),
  };

  return (
    <ReadingListContext.Provider value={value}>
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  const context = useContext(ReadingListContext);
  if (!context) {
    throw new Error('useReadingList must be used within ReadingListProvider');
  }
  return context;
}

export default ReadingListContext;