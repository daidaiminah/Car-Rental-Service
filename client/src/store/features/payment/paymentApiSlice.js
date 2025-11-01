import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiBaseUrl } from '../../../utils/socketEnv';

export const paymentApiSlice = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    getPaymentSummary: builder.query({
      query: () => '/payments/my-summary',
      providesTags: ['Payment'],
      transformResponse: (response) => response?.data ?? { transactions: [], paymentMethods: [] },
    }),
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: '/payments/create-payment-intent',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: '/payments/create-checkout-session',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useGetPaymentSummaryQuery,
  useCreatePaymentIntentMutation,
  useCreateCheckoutSessionMutation,
} = paymentApiSlice;
