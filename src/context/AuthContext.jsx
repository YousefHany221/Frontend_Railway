import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const getDashboardPath = (role) => {
  const rolePaths = {
    admin: '/admin/dashboard',
    nurse: '/nurse/dashboard',
    police: '/police/dashboard',
    user: '/parent/dashboard',
  };
  return rolePaths[role] || '/login';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('nbis_token');
    const storedUser = localStorage.getItem('nbis_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, user } = response;
      
      localStorage.setItem('nbis_token', token);
      localStorage.setItem('nbis_user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors,
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await authService.register(data);
      const { token, user } = response;
      
      localStorage.setItem('nbis_token', token);
      localStorage.setItem('nbis_user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors,
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('nbis_token');
      localStorage.removeItem('nbis_user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      console.log('getCurrentUser response:', response);
      setUser(response.user);
      localStorage.setItem('nbis_user', JSON.stringify(response.user));
      return response.user;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
