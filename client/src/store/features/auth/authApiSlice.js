import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiBaseUrl } from '../../../utils/socketEnv';

// Create the auth API slice
export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: getApiBaseUrl(),
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
      query: (credentials) => {
        // Extract role from credentials
        const { email, password, role } = credentials;
        return {
          url: '/auth/login',
          method: 'POST',
          body: { 
            email, 
            password, 
            ...(role && { role }) // Only include role if it exists
          },
        };
      },
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
        // Handle role-based errors
        if (response.status === 403) {
          return {
            status: response.status,
            message: response.data?.message || 'Insufficient permissions for this action'
          };
        }
        return {
          status: response.status,
          message: response.data?.message || 'Login failed. Please try again.'
        };
      },
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response, meta) => {
        console.log('Signup response:', { response, status: meta?.response?.status });
        
        // Check if response is valid
        if (!response) {
          throw new Error('No response received from server');
        }
        
        // The backend returns the response directly
        if (response.token) {
          return {
            ...response,  // Spread all user data
            token: response.token
          };
        }
        
        // If we get here, the response doesn't contain a token
        throw new Error('Invalid response format: missing token');
      },
      transformErrorResponse: (response, meta) => {
        console.error('Signup error response:', { 
          status: response?.status, 
          data: response?.data,
          originalStatus: meta?.response?.status,
          response: meta?.response
        });
        
        // Handle different types of errors
        let errorMessage = 'An error occurred during signup';
        let validationErrors = [];
        
        if (response?.data) {
          // Handle validation errors
          if (Array.isArray(response.data.errors)) {
            validationErrors = response.data.errors;
            errorMessage = 'Please fix the following errors:';
          } 
          // Handle single error message
          else if (response.data.message) {
            errorMessage = response.data.message;
          }
        } 
        // Handle network errors
        else if (response?.status === 'FETCH_ERROR') {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        }
        
        return {
          status: response?.status || 500,
          message: errorMessage,
          errors: validationErrors,
          ...(process.env.NODE_ENV !== 'production' && {
            originalError: response?.data,
            stack: new Error().stack
          })
        };
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
