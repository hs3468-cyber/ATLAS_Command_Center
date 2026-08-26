import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('atlas_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('atlas_token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      apiService.getMe(token).then((res) => {
        if (res.isConnected && res.data) {
          setUser(res.data);
          localStorage.setItem('atlas_user', JSON.stringify(res.data));
        } else {
          logout();
        }
      });
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await apiService.login(username, password);
      if (res.isConnected && res.data && res.data.access_token) {
        const authToken = res.data.access_token;
        const authUser = res.data.user;

        setToken(authToken);
        setUser(authUser);

        localStorage.setItem('atlas_token', authToken);
        localStorage.setItem('atlas_user', JSON.stringify(authUser));

        setLoading(false);
        return { success: true, user: authUser };
      } else {
        setLoading(false);
        return {
          success: false,
          error: res.error || 'Invalid credentials or backend unreachable.'
        };
      }
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('atlas_token');
    localStorage.removeItem('atlas_user');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isUser,
        login,
        logout
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
