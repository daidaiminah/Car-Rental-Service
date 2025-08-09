import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/features/auth/authSlice';

/**
 * Protected route component that redirects to login if user is not authenticated
 * This uses Redux instead of the previous context-based approach
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(state => state.auth.user);
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = 
      user.role === 'owner' ? '/owner-dashboard' :
      user.role === 'customer' ? '/renter-dashboard' :
      user.role === 'admin' ? '/admin-dashboard' :
      '/';
    
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has required role (if specified)
  return children;
};

export default ProtectedRoute;
