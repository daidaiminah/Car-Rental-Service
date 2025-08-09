import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../store/features/auth/authSlice';

/**
 * Custom hook to access authentication state from Redux
 * This replaces the previous context-based useAuth hook
 * @returns {Object} Authentication state and helper methods
 */
export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Helper functions to check user roles
  const isAdmin = () => isAuthenticated && user?.role === 'admin';
  const isOwner = () => isAuthenticated && user?.role === 'owner';
  const isRenter = () => isAuthenticated && user?.role === 'customer';
  
  return {
    user,
    isAuthenticated,
    isAdmin,
    isOwner,
    isRenter
  };
};

export default useAuth;
