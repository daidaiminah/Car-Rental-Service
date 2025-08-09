import { createSlice } from '@reduxjs/toolkit';
import { rentalsApiSlice } from './rentalsApiSlice';

const initialState = {
  rentals: [],
  userRentals: [], // Rentals for the current user (either as renter or owner)
  selectedRental: null,
  isLoading: false,
  error: null,
};

const rentalsSlice = createSlice({
  name: 'rentals',
  initialState,
  reducers: {
    setSelectedRental: (state, action) => {
      state.selectedRental = action.payload;
    },
    clearSelectedRental: (state) => {
      state.selectedRental = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getAllRentals
      .addMatcher(
        rentalsApiSlice.endpoints.getAllRentals.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        rentalsApiSlice.endpoints.getAllRentals.matchFulfilled,
        (state, { payload }) => {
          state.rentals = payload;
          state.isLoading = false;
        }
      )
      .addMatcher(
        rentalsApiSlice.endpoints.getAllRentals.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload?.message || 'Failed to fetch rentals';
        }
      )
      
      // Handle getRentalsByRenterId
      .addMatcher(
        rentalsApiSlice.endpoints.getRentalsByRenterId.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        rentalsApiSlice.endpoints.getRentalsByRenterId.matchFulfilled,
        (state, { payload }) => {
          state.userRentals = payload;
          state.isLoading = false;
        }
      )
      .addMatcher(
        rentalsApiSlice.endpoints.getRentalsByRenterId.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload?.message || 'Failed to fetch renter rentals';
        }
      )
      
      // Handle getRentalsByOwnerId
      .addMatcher(
        rentalsApiSlice.endpoints.getRentalsByOwnerId.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        rentalsApiSlice.endpoints.getRentalsByOwnerId.matchFulfilled,
        (state, { payload }) => {
          state.userRentals = payload;
          state.isLoading = false;
        }
      )
      .addMatcher(
        rentalsApiSlice.endpoints.getRentalsByOwnerId.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload?.message || 'Failed to fetch owner rentals';
        }
      )
      
      // Handle getRentalById
      .addMatcher(
        rentalsApiSlice.endpoints.getRentalById.matchFulfilled,
        (state, { payload }) => {
          state.selectedRental = payload;
        }
      );
  },
});

export const { setSelectedRental, clearSelectedRental } = rentalsSlice.actions;

export default rentalsSlice.reducer;

// Selectors
export const selectAllRentals = (state) => state.rentals.rentals;
export const selectUserRentals = (state) => state.rentals.userRentals;
export const selectSelectedRental = (state) => state.rentals.selectedRental;
export const selectRentalsLoading = (state) => state.rentals.isLoading;
export const selectRentalsError = (state) => state.rentals.error;
