
import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { getStorageKey, loadList, saveList } from '../utils/readingListStorage';
import { useToast } from './ToastContext';

const ReadingListContext = createContext(null);

export function readingListReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK': {
      if (!action.payload || action.payload.id === undefined) return state;
      if (state.some((book) => book.id === action.payload.id)) return state;
      return [...state, action.payload];
    }
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

function normaliseBook(book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    coverImage: book.coverImage || null,
    genreName: book.genre?.name || book.genreName || null,
  };
}

export function ReadingListProvider({ children }) {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const userId = user?.id ?? null;
  const storageKey = getStorageKey(userId);

  const [readingList, dispatch] = useReducer(readingListReducer, storageKey, loadList);
  const [hydratedKey, setHydratedKey] = useState(storageKey);

  useEffect(() => {
    if (hydratedKey === storageKey) return;
    dispatch({ type: 'SET_LIST', payload: loadList(storageKey) });
    setHydratedKey(storageKey);
  }, [storageKey, hydratedKey]);

  useEffect(() => {
    if (!token || !userId) return;
    async function fetchFromBackend() {
      try {
        const response = await api.get('/reading-list');
        const backendList = response.data.map((item) => normaliseBook(item.book));
        dispatch({ type: 'SET_LIST', payload: backendList });
      } catch (error) {
        // Fall back to localStorage if backend fails
      }
    }
    fetchFromBackend();
  }, [token, userId]);

  useEffect(() => {
    if (hydratedKey !== storageKey) return;
    if (token && userId) return;
    saveList(storageKey, readingList);
  }, [storageKey, hydratedKey, readingList, token, userId]);

  async function addBook(book) {
    const normalised = normaliseBook(book);
    dispatch({ type: 'ADD_BOOK', payload: normalised });
    addToast(`"${book.title}" added to reading list`, 'success');
    if (token && userId) {
      try {
        await api.post('/reading-list', { bookId: book.id });
      } catch (error) {
        dispatch({ type: 'REMOVE_BOOK', payload: book.id });
        addToast('Failed to save to server.', 'error');
      }
    }
  }

  async function removeBook(bookId) {
    dispatch({ type: 'REMOVE_BOOK', payload: bookId });
    addToast('Book removed from reading list', 'info');
    if (token && userId) {
      try {
        await api.delete(`/reading-list/${bookId}`);
      } catch (error) {
        // Optionally re-fetch to ensure consistency
      }
    }
  }

  async function clearList() {
    dispatch({ type: 'CLEAR_LIST' });
    addToast('Reading list cleared', 'info');
    if (token && userId) {
      try {
        await api.delete('/reading-list');
      } catch (error) {
        // Optionally re-fetch to ensure consistency
      }
    }
  }

  function isInList(bookId) {
    return readingList.some((book) => book.id === bookId);
  }

  return (
    <ReadingListContext.Provider value={{ readingList, count: readingList.length, dispatch, addBook, removeBook, clearList, isInList }}>
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  const context = useContext(ReadingListContext);
  if (context === null) {
    throw new Error('useReadingList must be used inside a ReadingListProvider.');
  }
  return context;
}