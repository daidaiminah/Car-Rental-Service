import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create base query with auth headers
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If we have a token, add it to the headers
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

// Create API slice
const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    
    // Handle 401 Unauthorized errors (token expired)
    if (result.error?.status === 401) {
      // Attempt to refresh the token
      const refreshResult = await baseQuery(
        { url: '/auth/refresh-token', method: 'POST' },
        api,
        extraOptions
      );
      
      if (refreshResult.data?.token) {
        // Store the new token
        localStorage.setItem('token', refreshResult.data.token);
        
        // Retry the original request with the new token
        result = await baseQuery({
          ...args,
          headers: {
            ...args.headers,
            authorization: `Bearer ${refreshResult.data.token}`,
          },
        }, api, extraOptions);
      } else {
        // If refresh fails, clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return result;
  },
  tagTypes: ['Auth', 'User', 'Car', 'Booking', 'Rental', 'Payment', 'Customer', 'FeaturedCars', 'AvailableCars'],
  endpoints: (builder) => ({}), // We'll inject endpoints in other files
});

export default apiSlice;
