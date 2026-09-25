import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('careerpath_token'));
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Load current user profile if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to load user profile:', error.message);
        localStorage.removeItem('careerpath_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('careerpath_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        addToast(`Welcome back, ${receivedUser.name}!`, 'success');
        return { success: true, user: receivedUser };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(message, 'error');
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('careerpath_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        addToast('Account created successfully! Welcome to CareerPath.', 'success');
        return { success: true, user: receivedUser };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      addToast(message, 'error');
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('careerpath_token');
    setToken(null);
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
