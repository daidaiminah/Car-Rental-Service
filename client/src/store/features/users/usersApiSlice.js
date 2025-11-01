import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiBaseUrl } from '../../../utils/socketEnv';

export const usersApiSlice = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token || localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Get all users (admin only)
    getAllUsers: builder.query({
      query: () => '/user',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User', id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    
    // Get user profile
    getUserProfile: builder.query({
      query: (userId) => ({
        url: `/users/profile/${userId}`,
        method: 'GET',
      }),
      providesTags: (result) => [{ type: 'User', id: result?.id || 'CURRENT' }],
      transformResponse: (response) => {
        // If the response is wrapped in a data property, return it directly
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
    }),
    
    // Update user profile
    updateUserProfile: builder.mutation({
      query: (userData) => {
        // If userData is a FormData object, let the browser set the Content-Type
        if (userData instanceof FormData) {
          return {
            url: '/users/profile',
            method: 'PUT',
            body: userData,
            formData: true, // Important for RTK Query to handle FormData
          };
        }
        // Otherwise, send as JSON
        return {
          url: '/users/profile',
          method: 'PUT',
          body: userData,
        };
      },
      // Instead of invalidating, we provide the updated user data directly to the cache.
      // This is more efficient as it avoids a follow-up refetch.
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),
    
      // Change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/user/change-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    // Get car owners (for admin dashboard)
    getCarOwners: builder.query({
      query: () => '/users/owners',
      providesTags: [{ type: 'User', id: 'OWNERS' }],
    }),
    
    // Get renters (for admin dashboard)
    getRenters: builder.query({
      query: () => '/user/renters',
      providesTags: [{ type: 'User', id: 'RENTERS' }],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
} = usersApiSlice;

export default usersApiSlice;
