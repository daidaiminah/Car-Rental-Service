import { createSlice } from '@reduxjs/toolkit';

// Helper to get initial state from localStorage
const getUserFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    return {
      user: user || null,
      token: token || null,
      isAuthenticated: !!token,
      role: user?.role || null,
    };
  } catch (error) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
    };
  }
};

const initialState = getUserFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set credentials after successful login/signup
    setCredentials: (state, { payload }) => {
      const { user, token } = payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.role = user?.role || null;
      
      // Persist to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    
    // Clear credentials on logout
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    // Update user profile
    updateUser: (state, { payload }) => {
      if (state.user) {
        state.user = { ...state.user, ...payload };
        localStorage.setItem('user', JSON.stringify(state.user));
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
