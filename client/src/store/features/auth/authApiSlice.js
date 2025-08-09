import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Helper function to get the base URL based on environment
const getBaseUrl = () => {
  // In development, use the local server
  if (process.env.NODE_ENV === 'development') {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // In production, use your production URL
  return 'https://whip-in-time-server.onrender.com/api';
};

// Create the auth API slice
export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        // The backend sends the token inside response.data
        if (response && response.data) {
          return {
            ...response.data,  // Spread all user data
            token: response.data.token  // Get token from data object
          };
        }
        return response;
      },
      transformErrorResponse: (response) => {
        // Transform error response to be more descriptive
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'An error occurred during login',
        };
      },
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response) => {
        if (response && response.data) {
          return { ...response.data, token: response.token };
        }
        return response;
      },
    }),
    getCurrentUser: builder.query({
      query: () => '/auth/me',
      transformResponse: (response) => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
    }),
  }),
});

// Export the auto-generated hooks for each endpoint
export const {
  useLoginMutation,
  useSignupMutation,
  useGetCurrentUserQuery,
} = authApiSlice;
