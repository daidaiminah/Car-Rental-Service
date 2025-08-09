import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCredentials, 
  logOut as logoutAction, 
  selectCurrentUser, 
  selectIsAuthenticated,
  selectUserRole 
} from './features/auth/authSlice';
import { useLoginMutation } from './store';
import { useGetCurrentUserQuery } from './features/auth/authApiSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const [login] = useLoginMutation();
  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Effect to handle user authentication state
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token && !user) {
        try {
          // The useGetCurrentUserQuery will automatically fetch the current user
          // and update the Redux store when the component mounts
          // We just need to wait for the query to complete
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          // If fetching user fails, log out
          dispatch(logoutAction());
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [dispatch, navigate, user]);

  // Handle login
  const loginUser = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      if (result?.token) {
        const { token, ...user } = result;
        dispatch(setCredentials({ user, token }));
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  // Handle logout
  const logout = () => {
    dispatch(logoutAction());
    navigate('/login');
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!userRole) return false;
    return userRole === role;
  };

  const value = {
    user: currentUser || user,
    isAuthenticated,
    isLoading,
    login: loginUser,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
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
