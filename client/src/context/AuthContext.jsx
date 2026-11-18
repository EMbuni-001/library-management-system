
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { getMillisecondsUntilExpiry } from '../utils/jwt';
import { mergeGuestListIntoUser } from '../utils/readingListStorage';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

function readStoredToken() {
  try {
    return window.localStorage.getItem('lms.token') || '';
  } catch (error) {
    return '';
  }
}

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem('lms.user');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function getApiErrorMessage(error, fallback) {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message;

    if (Array.isArray(message)) {
      return message.join(' ');
    }
    if (typeof message === 'string' && message.trim() !== '') {
      return message;
    }
    if (status === 401) {
      return 'Email or password is incorrect.';
    }
    if (status === 409) {
      return 'An account with that email already exists.';
    }
    if (status === 429) {
      return 'Too many attempts. Please wait a minute.';
    }
    return 'The server could not complete that request.';
  }

  if (error.request) {
    return 'Cannot reach the server. Confirm the API is running.';
  }

  return fallback;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken);
  const [user, setUser] = useState(readStoredUser);
  const { addToast } = useToast();

  function persistSession(nextToken, nextUser) {
    try {
      window.localStorage.setItem('lms.token', nextToken);
      window.localStorage.setItem('lms.user', JSON.stringify(nextUser));
    } catch (error) {
      // Session works in memory even if storage fails
    }
    setToken(nextToken);
    setUser(nextUser);
  }

  useEffect(() => {
    if (!token) return;

    const msUntilExpiry = getMillisecondsUntilExpiry(token);

    if (msUntilExpiry === 0) {
      logout();
      addToast('Your session has expired. Please log in again.', 'info');
      return;
    }

    const timeoutId = setTimeout(() => {
      logout();
      addToast('Your session has expired. Please log in again.', 'info');
    }, msUntilExpiry);

    return () => clearTimeout(timeoutId);
  }, [token, addToast]);

  async function login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password,
      });

      const accessToken = response.data?.access_token || response.data?.token || '';

      if (!accessToken) {
        return { ok: false, message: 'The server did not return a token.' };
      }

      const profile = response.data?.user || null;
      mergeGuestListIntoUser(profile?.id);
      persistSession(accessToken, profile);
      addToast('Welcome back!', 'success');

      return { ok: true, user: profile };
    } catch (error) {
      return { ok: false, message: getApiErrorMessage(error, 'Could not log in.') };
    }
  }

  async function register(details) {
    const payload = {
      name: details.name.trim(),
      email: details.email.trim(),
      password: details.password,
    };

    try {
      const response = await api.post('/auth/register', payload);
      const accessToken = response.data?.access_token || response.data?.token || '';

      if (accessToken) {
        const profile = response.data?.user || {
          id: response.data?.id,
          email: response.data?.email,
          name: response.data?.name,
          role: response.data?.role,
        };

        mergeGuestListIntoUser(profile?.id);
        persistSession(accessToken, profile);
        addToast('Account created successfully!', 'success');

        return { ok: true, user: profile };
      }

      const loginResult = await login({
        email: payload.email,
        password: payload.password,
      });

      if (loginResult.ok) {
        addToast('Account created and logged in!', 'success');
        return loginResult;
      }

      return {
        ok: false,
        redirectToLogin: true,
        message: 'Account created. Please log in.',
      };
    } catch (error) {
      return {
        ok: false,
        message: getApiErrorMessage(error, 'Could not create your account.'),
      };
    }
  }

  function logout() {
    try {
      window.localStorage.removeItem('lms.token');
      window.localStorage.removeItem('lms.user');
    } catch (error) {
      // Ignore storage errors
    }
    setToken('');
    setUser(null);
    addToast('You have been logged out.', 'info');
  }

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: Boolean(token), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }
  return context;
}