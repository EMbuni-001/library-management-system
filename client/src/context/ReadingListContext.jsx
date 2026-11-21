
import { createContext, useContext, useEffect, useReducer } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ReadingListContext = createContext();

const STORAGE_KEY = 'library-reading-list';

function readingListReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK':
      if (state.some((book) => book.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];

    case 'REMOVE_BOOK':
      return state.filter((book) => book.id !== action.payload);

    case 'CLEAR_LIST':
      return [];

    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const [readingList, dispatch] = useReducer(readingListReducer, [], () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readingList));
    } catch (error) {
      // Storage might be full or unavailable
    }
  }, [readingList]);

  useEffect(() => {
    if (token && user?.id) {
      addToast('Reading list synced with your account', 'info');
    }
  }, [token, user?.id]);

  const value = {
    readingList,
    count: readingList.length,
    dispatch,
    addBook: (book) => {
      dispatch({ type: 'ADD_BOOK', payload: book });
      addToast(`"${book.title}" added to reading list`, 'success');
    },
    removeBook: (bookId) => {
      dispatch({ type: 'REMOVE_BOOK', payload: bookId });
      addToast('Book removed from reading list', 'info');
    },
    clearList: () => {
      dispatch({ type: 'CLEAR_LIST' });
      addToast('Reading list cleared', 'info');
    },
    // THIS WAS MISSING:
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