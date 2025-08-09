import { createSlice } from '@reduxjs/toolkit';
import { customersApiSlice } from './customersApiSlice';

const initialState = {
  customers: [],
  selectedCustomer: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle getAllCustomers
      .addMatcher(
        customersApiSlice.endpoints.getAllCustomers.matchPending,
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        customersApiSlice.endpoints.getAllCustomers.matchFulfilled,
        (state, action) => {
          state.status = 'succeeded';
          state.customers = action.payload;
          state.error = null;
        }
      )
      .addMatcher(
        customersApiSlice.endpoints.getAllCustomers.matchRejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      )
      // Handle getCustomerById
      .addMatcher(
        customersApiSlice.endpoints.getCustomerById.matchFulfilled,
        (state, action) => {
          state.selectedCustomer = action.payload;
        }
      );
  }
});

export const { setSelectedCustomer, clearSelectedCustomer } = customersSlice.actions;

export const selectAllCustomers = (state) => state.customers.customers;
export const selectSelectedCustomer = (state) => state.customers.selectedCustomer;
export const selectCustomersStatus = (state) => state.customers.status;
export const selectCustomersError = (state) => state.customers.error;

export default customersSlice.reducer;
