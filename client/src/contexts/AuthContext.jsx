import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin, logout as authLogout, setAuthToken } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on initial load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role = 'customer') => {
    try {
      const response = await authLogin({ email, password, role });
      
      // Check if the response has a nested data structure
      const userData = response.data ? response.data : response;
      const token = userData.token;
      
      // Store token and user data
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      
      console.log('User role after login:', userData.role);
      
      // Redirect based on user role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'owner') {
        navigate('/owner-dashboard');
      } else if (userData.role === 'customer') {
        navigate('/renter-dashboard');
      } else {
        // Default fallback
        navigate('/renter-dashboard');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (role) => {
    if (role === 'customer' && user?.role === 'renter') return true;
    if (role === 'customer' && !user?.role) return true; // Default role is customer
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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

export default AuthContext;
