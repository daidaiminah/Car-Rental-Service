import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiBaseUrl } from '../../../utils/socketEnv';

export const rentalsApiSlice = createApi({
  reducerPath: 'rentalsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Rentals'],
  endpoints: (builder) => ({
    // Get a single rental by ID
    getRental: builder.query({
      query: (rentalId) => `/rentals/${rentalId}`,
      providesTags: (result, error, id) => [{ type: 'Rentals', id }],
    }),
    
    // Get all rentals (admin only)
    getAllRentals: builder.query({
      query: () => '/rentals',
      providesTags: (result) => {
        // Handle different response formats
        const rentals = Array.isArray(result?.data) ? result.data : 
                      Array.isArray(result) ? result : [];
                      
        return [
          ...rentals.map(({ id }) => ({ type: 'Rentals', id })),
          { type: 'Rentals', id: 'LIST' },
        ];
      },
    }),
    
    // Get rentals by renter ID (for renter dashboard)
    getRentalsByRenterId: builder.query({
      query: (renterId) => `/rentals/renter/${renterId}`,
      providesTags: (result) => {
        const rentals = Array.isArray(result?.data) ? result.data : 
                      Array.isArray(result) ? result : [];
        return [
          ...rentals.map(({ id }) => ({ type: 'Rentals', id })),
          { type: 'Rentals', id: 'RENTER_LIST' },
        ];
      },
    }),
    
    // Get rentals by owner ID (for owner dashboard)
    getRentalsByOwnerId: builder.query({
      query: (ownerId) => ({
        url: ownerId ? `/rentals/owner/${ownerId}` : '/rentals/owner/me',
        method: 'GET'
      }),
      providesTags: (result) => {
        const rentals = Array.isArray(result?.data) ? result.data : 
                      Array.isArray(result) ? result : [];
        return [
          ...rentals.map(({ id }) => ({ type: 'Rentals', id })),
          { type: 'Rentals', id: 'OWNER_LIST' },
        ];
      },
    }),
    
    // Get rentals by car ID
    getRentalsByCarId: builder.query({
      query: (carId) => `/rentals?carId=${carId}`,
      providesTags: (result) => {
        const rentals = Array.isArray(result?.data) ? result.data : 
                      Array.isArray(result) ? result : [];
        return [
          ...rentals.map(({ id }) => ({ type: 'Rentals', id })),
          { type: 'Rentals', id: 'CAR_RENTALS' },
        ];
      },
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
      transformErrorResponse: (response, meta, arg) => {
        console.error('Rental creation error:', response);
        return response;
      },
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
    
    // Update rental status
    updateRentalStatus: builder.mutation({
      query: ({ rentalId, status, rejectionReason }) => ({
        url: `/rentals/${rentalId}/status`,
        method: 'PATCH',
        body: { status, rejectionReason },
      }),
      invalidatesTags: (result, error, { rentalId }) => [
        { type: 'Rentals', id: rentalId },
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
  useGetRentalQuery,
  useGetAllRentalsQuery,
  useGetRentalsByRenterIdQuery,
  useGetRentalsByOwnerIdQuery,
  useGetRentalsByCarIdQuery,
  useGetRentalByIdQuery,
  useCreateRentalMutation,
  useUpdateRentalMutation,
  useUpdateRentalStatusMutation,
  useDeleteRentalMutation,
} = rentalsApiSlice;
