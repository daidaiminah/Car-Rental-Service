import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApiSlice = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // Get all users (admin only)
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users', id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    
    // Get user profile
    getUserProfile: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    
    // Update user profile
    updateUserProfile: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),
    
    // Change password
    changePassword: builder.mutation({
      query: ({ id, ...passwordData }) => ({
        url: `/users/${id}/password`,
        method: 'PUT',
        body: passwordData,
      }),
    }),
    
    // Get car owners (for admin dashboard)
    getCarOwners: builder.query({
      query: () => '/users/owners',
      providesTags: [{ type: 'Users', id: 'OWNERS' }],
    }),
    
    // Get renters (for admin dashboard)
    getRenters: builder.query({
      query: () => '/users/renters',
      providesTags: [{ type: 'Users', id: 'RENTERS' }],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useGetCarOwnersQuery,
  useGetRentersQuery,
} = usersApiSlice;
