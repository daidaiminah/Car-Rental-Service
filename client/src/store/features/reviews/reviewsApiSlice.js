import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewsApiSlice = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token || localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    getCarReviews: builder.query({
      query: (carId) => `/reviews/car/${carId}`,
      transformResponse: (response) => ({
        reviews: response?.data?.reviews ?? [],
        averageRating: response?.data?.averageRating ?? 0,
        totalReviews: response?.data?.totalReviews ?? 0,
        pagination: response?.data?.pagination ?? null,
      }),
      providesTags: (result, error, carId) =>
        result?.reviews
          ? [
              ...result.reviews.map(({ id }) => ({ type: 'Reviews', id })),
              { type: 'Reviews', id: `CAR_${carId}` },
            ]
          : [{ type: 'Reviews', id: `CAR_${carId}` }],
    }),
    createReview: builder.mutation({
      query: (payload) => ({
        url: '/reviews',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { carId }) => [
        { type: 'Reviews', id: `CAR_${carId}` },
      ],
    }),
    deleteReview: builder.mutation({
      query: ({ reviewId }) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { carId }) => [
        { type: 'Reviews', id: `CAR_${carId}` },
      ],
    }),
  }),
});

export const {
  useGetCarReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApiSlice;

export default reviewsApiSlice;
