import { createSlice } from '@reduxjs/toolkit';
import { usersApiSlice } from './usersApiSlice';

const initialState = {
  users: [],
  carOwners: [],
  renters: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getAllUsers
      .addMatcher(
        usersApiSlice.endpoints.getAllUsers.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        usersApiSlice.endpoints.getAllUsers.matchFulfilled,
        (state, { payload }) => {
          state.users = payload;
          state.isLoading = false;
        }
      )
      .addMatcher(
        usersApiSlice.endpoints.getAllUsers.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload?.message || 'Failed to fetch users';
        }
      )
      
      // Handle getUserProfile
      .addMatcher(
        usersApiSlice.endpoints.getUserProfile.matchFulfilled,
        (state, { payload }) => {
          state.selectedUser = payload;
        }
      )
      
      // Handle getCarOwners
      .addMatcher(
        usersApiSlice.endpoints.getCarOwners.matchFulfilled,
        (state, { payload }) => {
          state.carOwners = payload;
        }
      )
      
      // Handle getRenters
      .addMatcher(
        usersApiSlice.endpoints.getRenters.matchFulfilled,
        (state, { payload }) => {
          state.renters = payload;
        }
      );
  },
});

export const { setSelectedUser, clearSelectedUser } = usersSlice.actions;

export default usersSlice.reducer;

// Selectors
export const selectAllUsers = (state) => state.users.users;
export const selectCarOwners = (state) => state.users.carOwners;
export const selectRenters = (state) => state.users.renters;
export const selectSelectedUser = (state) => state.users.selectedUser;
export const selectUsersLoading = (state) => state.users.isLoading;
export const selectUsersError = (state) => state.users.error;
