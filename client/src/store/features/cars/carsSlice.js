import { createSlice } from '@reduxjs/toolkit';
import carsApi from './carsApiSlice';

const initialState = {
  cars: [],
  featuredCars: [],
  selectedCar: null,
  filters: {
    searchTerm: '',
    status: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    transmission: ''
  },
  isLoading: false,
  error: null,
};

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedCar: (state, action) => {
      state.selectedCar = action.payload;
    },
    clearSelectedCar: (state) => {
      state.selectedCar = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getCars
      .addMatcher(
        carsApi.endpoints.getCars.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        carsApi.endpoints.getCars.matchFulfilled,
        (state, { payload }) => {
          state.cars = payload;
          state.isLoading = false;
        }
      )
      .addMatcher(
        carsApi.endpoints.getCars.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload?.message || 'Failed to fetch cars';
        }
      )
      
      // Handle getFeaturedCars
      .addMatcher(
        carsApi.endpoints.getFeaturedCars.matchFulfilled,
        (state, { payload }) => {
          state.featuredCars = payload;
        }
      )
      
      // Handle getCarById
      .addMatcher(
        carsApi.endpoints.getCarById.matchFulfilled,
        (state, { payload }) => {
          state.selectedCar = payload;
        }
      );
  },
});

export const { 
  setFilters, 
  clearFilters, 
  setSelectedCar, 
  clearSelectedCar 
} = carsSlice.actions;

export default carsSlice.reducer;

// Selectors
export const selectAllCars = (state) => state.cars.cars;
export const selectFeaturedCars = (state) => state.cars.featuredCars;
export const selectSelectedCar = (state) => state.cars.selectedCar;
export const selectCarFilters = (state) => state.cars.filters;
export const selectCarsLoading = (state) => state.cars.isLoading;
export const selectCarsError = (state) => state.cars.error;
