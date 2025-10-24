/**
 * Redux Store Configuration with Redux Persist
 * 
 * This file configures the Redux store with Redux Persist for state persistence.
 * It combines all reducers, sets up middleware, and enables persistence for specific parts of the state.
 */

// Core Redux and Redux Toolkit imports
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers } from '@reduxjs/toolkit';

// Redux Persist imports
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Import API slices
import apiSlice from './apiSlice';
import carsApi from './features/cars/carsApiSlice';
import { authApiSlice } from './features/auth/authApiSlice';
import { rentalsApiSlice } from './features/rentals/rentalsApiSlice';
import { usersApiSlice } from './features/users/usersApiSlice';
import { paymentApiSlice } from './features/payment/paymentApiSlice';
import { wishlistApiSlice } from './features/wishlist/wishlistApiSlice';
import { notificationsApiSlice } from './features/notifications/notificationsApiSlice';
import { reviewsApiSlice } from './features/reviews/reviewsApiSlice';


// Import feature reducers
import authReducer from './features/auth/authSlice';

// Inject endpoints into the API slice
const enhancedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // User endpoints
    updateCurrentUser: builder.mutation({
      query: (updates) => ({
        url: '/auth/me',
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Car endpoints
    getCars: builder.query({
      query: (filters = {}) => ({
        url: '/cars',
        params: filters,
      }),
      providesTags: ['Car'],
    }),
    //Featured Cars endpoints
    getFeaturedCars: builder.query({
      query: (limit = 6) => ({
        url: '/cars/featured',
        params: { limit },
      }),
      providesTags: ['FeaturedCars'],
    }),
    
    getCarById: builder.query({
      query: (id) => `/cars/${id}`,
      providesTags: (result, error, id) => [{ type: 'Car', id }],
    }),
    
    createCar: builder.mutation({
      query: (carData) => ({
        url: '/cars',
        method: 'POST',
        body: carData,
      }),
      invalidatesTags: ['Car', 'FeaturedCars'],
    }),
    
    updateCar: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/cars/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Car', id },
        'FeaturedCars',
      ],
    }),
    
    deleteCar: builder.mutation({
      query: (id) => ({
        url: `/cars/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Car', 'FeaturedCars'],
    }),
    
    getAvailableCars: builder.query({
      query: () => '/cars/available',
      providesTags: ['AvailableCars'],
    }),
  }),
});

// Configuration for Redux Persist
const persistConfig = {
  key: 'root', // Key for the persisted state in storage
  storage, // Storage engine (localStorage by default)
  version: 1, // Version number for the persisted state (useful for migrations)
  // Define which reducers to persist and their configuration
  blacklist: [apiSlice.reducerPath, carsApi.reducerPath, rentalsApiSlice.reducerPath, paymentApiSlice.reducerPath, wishlistApiSlice.reducerPath, notificationsApiSlice.reducerPath, reviewsApiSlice.reducerPath], // Don't persist API caches
  // Whitelist would be used to specify which reducers to persist, but we're using blacklist here
};

// Import the cars reducer
import carsReducer from './features/cars/carsSlice';

// Combine all reducers
const rootReducer = combineReducers({
  // API reducers (not persisted)
  [apiSlice.reducerPath]: apiSlice.reducer,
  [carsApi.reducerPath]: carsApi.reducer,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [rentalsApiSlice.reducerPath]: rentalsApiSlice.reducer,
  [usersApiSlice.reducerPath]: usersApiSlice.reducer,
  [paymentApiSlice.reducerPath]: paymentApiSlice.reducer,
  [wishlistApiSlice.reducerPath]: wishlistApiSlice.reducer,
  [notificationsApiSlice.reducerPath]: notificationsApiSlice.reducer,
  [reviewsApiSlice.reducerPath]: reviewsApiSlice.reducer,
  
  // Feature reducers (persisted)
  auth: authReducer,
  cars: carsReducer,
  // Add other feature reducers here if needed
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types as they are used by Redux Persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
    .concat(apiSlice.middleware)
    .concat(carsApi.middleware)
    .concat(authApiSlice.middleware)
    .concat(rentalsApiSlice.middleware)
    .concat(usersApiSlice.middleware)
    .concat(paymentApiSlice.middleware)
    .concat(wishlistApiSlice.middleware)
    .concat(notificationsApiSlice.middleware)
    .concat(reviewsApiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create the persistor for the store
const persistor = persistStore(store);

// Enable refetchOnFocus/refetchOnReconnect behaviors for RTK Query
setupListeners(store.dispatch);

// Export the store and persistor
export { store, persistor };
export default store;

// Export hooks for use in components
export const {
  // Auth
  useLoginMutation,
  useSignupMutation,
  useGetCurrentUserQuery, // This now comes from authApiSlice
  
  // User
  useUpdateCurrentUserMutation,
  
  // Cars
  useGetCarsQuery,
  useGetFeaturedCarsQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
  useGetAvailableCarsQuery,
} = enhancedApi;
