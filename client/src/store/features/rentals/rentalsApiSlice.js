import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rentalsApiSlice = createApi({
  reducerPath: 'rentalsApi',
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
  tagTypes: ['Rentals'],
  endpoints: (builder) => ({
    // Get all rentals (admin only)
    getAllRentals: builder.query({
      query: () => '/rentals',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Rentals', id })),
              { type: 'Rentals', id: 'LIST' },
            ]
          : [{ type: 'Rentals', id: 'LIST' }],
    }),
    
    // Get rentals by renter ID (for renter dashboard)
    getRentalsByRenterId: builder.query({
      query: (renterId) => `/rentals/renter/${renterId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Rentals', id })),
              { type: 'Rentals', id: 'RENTER_LIST' },
            ]
          : [{ type: 'Rentals', id: 'RENTER_LIST' }],
    }),
    
    // Get rentals by owner ID (for owner dashboard)
    getRentalsByOwnerId: builder.query({
      query: (ownerId) => `/rentals/owner/${ownerId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Rentals', id })),
              { type: 'Rentals', id: 'OWNER_LIST' },
            ]
          : [{ type: 'Rentals', id: 'OWNER_LIST' }],
    }),
    
    // Get rentals by car ID
    getRentalsByCarId: builder.query({
      query: (carId) => `/rentals?carId=${carId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Rentals', id })),
              { type: 'Rentals', id: 'CAR_RENTALS' },
            ]
          : [{ type: 'Rentals', id: 'CAR_RENTALS' }],
    }),
    
    // Get a single rental by ID
    getRentalById: builder.query({
      query: (id) => `/rentals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Rentals', id }],
    }),
    
    // Create a new rental
    createRental: builder.mutation({
      query: (rentalData) => ({
        url: '/rentals',
        method: 'POST',
        body: rentalData,
      }),
      invalidatesTags: [
        { type: 'Rentals', id: 'LIST' },
        { type: 'Rentals', id: 'RENTER_LIST' },
        { type: 'Rentals', id: 'OWNER_LIST' },
      ],
    }),
    
    // Update a rental
    updateRental: builder.mutation({
      query: ({ id, ...rentalData }) => ({
        url: `/rentals/${id}`,
        method: 'PUT',
        body: rentalData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Rentals', id },
        { type: 'Rentals', id: 'LIST' },
        { type: 'Rentals', id: 'RENTER_LIST' },
        { type: 'Rentals', id: 'OWNER_LIST' },
      ],
    }),
    
    // Delete a rental
    deleteRental: builder.mutation({
      query: (id) => ({
        url: `/rentals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Rentals', id },
        { type: 'Rentals', id: 'LIST' },
        { type: 'Rentals', id: 'RENTER_LIST' },
        { type: 'Rentals', id: 'OWNER_LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllRentalsQuery,
  useGetRentalsByRenterIdQuery,
  useGetRentalsByOwnerIdQuery,
  useGetRentalsByCarIdQuery,
  useGetRentalByIdQuery,
  useCreateRentalMutation,
  useUpdateRentalMutation,
  useDeleteRentalMutation,
} = rentalsApiSlice;
