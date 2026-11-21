
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'lms.token';
const USER_KEY = 'lms.user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: credentials.email.trim(),
        password: credentials.password,
      });

      const accessToken = response.data?.access_token || response.data?.token;
      const userData = response.data?.user;

      if (!accessToken) {
        return { ok: false, message: 'Server did not return a token' };
      }

      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      setToken(accessToken);
      setUser(userData);

      addToast('Welcome back!', 'success');
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { ok: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password,
      });

      const accessToken = response.data?.access_token || response.data?.token;
      const newUser = response.data?.user;

      if (accessToken) {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));

        setToken(accessToken);
        setUser(newUser);

        addToast('Account created successfully!', 'success');
        return { ok: true };
      }

      const loginResult = await login({
        email: userData.email,
        password: userData.password,
      });

      if (loginResult.ok) {
        addToast('Account created and logged in!', 'success');
      }

      return loginResult;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { ok: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    addToast('You have been logged out', 'info');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;