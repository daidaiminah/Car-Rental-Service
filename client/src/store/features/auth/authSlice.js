import { createSlice } from '@reduxjs/toolkit';

// Helper to get initial state from localStorage or sessionStorage
const getStoredAuthData = () => {
  try {
    // Check if we should use localStorage or sessionStorage
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;
    
    // Try to get user data from the appropriate storage
    const user = JSON.parse(storage.getItem('user') || 'null');
    const token = storage.getItem('token');
    
    return {
      user: user || null,
      token: token || null,
      isAuthenticated: !!token,
      role: user?.role || null,
      rememberMe: rememberMe || false,
    };
  } catch (error) {
    console.error('Error reading auth data from storage:', error);
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      rememberMe: false,
    };
  }
};

const initialState = getStoredAuthData();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set credentials after successful login/signup
    setCredentials: (state, { payload }) => {
      const { user, token, rememberMe } = payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.role = user?.role || null;
      state.rememberMe = rememberMe || false;
      
      // Determine which storage to use based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      
      // Clear both storages first to avoid conflicts
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Store in the appropriate storage
      storage.setItem('token', token);
      storage.setItem('user', JSON.stringify(user));
      
      // Store rememberMe preference in localStorage
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
    },
    
    // Clear credentials on logout
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.rememberMe = false;
      
      // Clear both localStorage and sessionStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
    
    // Update user profile
    updateUser: (state, { payload }) => {
      if (state.user) {
        const updatedUser = { ...state.user, ...payload };
        state.user = updatedUser;
        
        // Update in the appropriate storage
        const storage = state.rememberMe ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(updatedUser));
      }
    },
  },
  extraReducers: (builder) => {
    // Handle login success
    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled') && 
                (action.meta?.arg?.endpointName === 'login' || 
                 action.meta?.arg?.endpointName === 'signup'),
      (state, { payload }) => {
        if (payload?.token) {
          const { token, ...user } = payload;
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
          state.role = user.role;
          
          // Persist to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    );
    
    // Handle getCurrentUser success
    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled') && 
                action.meta?.arg?.endpointName === 'getCurrentUser',
      (state, { payload }) => {
        if (payload) {
          state.user = payload;
          state.isAuthenticated = true;
          state.role = payload.role;
          
          // Update user in localStorage
          localStorage.setItem('user', JSON.stringify(payload));
        }
      }
    );
  },
});

export const { setCredentials, logOut, updateUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;

export default authSlice.reducer;
