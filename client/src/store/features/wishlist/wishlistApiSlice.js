import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wishlistApiSlice = createApi({
  reducerPath: 'wishlistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Wishlist'],
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((item) => ({ type: 'Wishlist', id: item.id })),
              { type: 'Wishlist', id: 'LIST' },
            ]
          : [{ type: 'Wishlist', id: 'LIST' }],
      transformResponse: (response) => response?.data ?? [],
    }),
    addToWishlist: builder.mutation({
      query: (payload) => ({
        url: '/wishlist',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),
    removeFromWishlist: builder.mutation({
      query: (carId) => ({
        url: `/wishlist/${carId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApiSlice;
