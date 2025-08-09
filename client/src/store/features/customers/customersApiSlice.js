import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customersApiSlice = createApi({
  reducerPath: 'customersApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: () => '/customers',
      providesTags: ['Customer'],
    }),
    getCustomerById: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    createCustomer: builder.mutation({
      query: (customerData) => ({
        url: '/customers',
        method: 'POST',
        body: customerData,
      }),
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...customerData }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: customerData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApiSlice;
