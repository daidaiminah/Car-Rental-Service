import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const carsApi = createApi({
  reducerPath: 'carsApi',
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
  tagTypes: ['Cars'],
  endpoints: (builder) => ({
    // Get all cars with optional filters
    getCars: builder.query({
      query: (filters = {}) => {
        // Convert filters object to query string
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        
        return {
          url: `/cars?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      transformResponse: (response) => {
        const data = response.data || response;
        
        // If data is an array, process each car to include review stats
        if (Array.isArray(data)) {
          return data.map(car => ({
            ...car,
            // Add default values if not present
            averageRating: car.averageRating || 0,
            reviewCount: car.reviewCount || 0
          }));
        }
        
        // If it's a single car object
        if (data && typeof data === 'object') {
          return {
            ...data,
            averageRating: data.averageRating || 0,
            reviewCount: data.reviewCount || 0
          };
        }
        
        return data;
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Cars', id })),
              { type: 'Cars', id: 'LIST' },
            ]
          : [{ type: 'Cars', id: 'LIST' }],
    }),
    
    // Get featured cars
    getFeaturedCars: builder.query({
      query: () => '/cars/featured',
      transformResponse: (response) => {
        const data = response.data || response;
        
        // If data is an array, process each car to include review stats
        if (Array.isArray(data)) {
          return data.map(car => ({
            ...car,
            // Add default values if not present
            averageRating: car.averageRating || 0,
            reviewCount: car.reviewCount || 0
          }));
        }
        
        // If it's a single car object
        if (data && typeof data === 'object') {
          return {
            ...data,
            averageRating: data.averageRating || 0,
            reviewCount: data.reviewCount || 0
          };
        }
        
        return data;
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Cars', id })),
              { type: 'Cars', id: 'FEATURED' },
            ]
          : [{ type: 'Cars', id: 'FEATURED' }],
    }),
    
    // Get a single car by ID
    getCarById: builder.query({
      query: (id) => `/cars/${id}`,
      transformResponse: (response) => {
        const data = response.data || response;
        
        // If data is an array, process each car to include review stats
        if (Array.isArray(data)) {
          return data.map(car => ({
            ...car,
            // Add default values if not present
            averageRating: car.averageRating || 0,
            reviewCount: car.reviewCount || 0
          }));
        }
        
        // If it's a single car object
        if (data && typeof data === 'object') {
          return {
            ...data,
            averageRating: data.averageRating || 0,
            reviewCount: data.reviewCount || 0
          };
        }
        
        return data;
      },
      providesTags: (result, error, id) => [{ type: 'Cars', id }],
    }),
    
    // Get cars by owner ID
    getCarsByOwnerId: builder.query({
      query: (ownerId) => {
        if (!ownerId) {
          console.error('No ownerId provided to getCarsByOwnerId');
          return 'cars/owner/invalid';
        }
        console.log('Fetching cars for owner ID:', ownerId);
        return `/cars/owner/${ownerId}`;
      },
      transformResponse: (response, meta, arg) => {
        console.log('getCarsByOwnerId response for owner', arg, ':', response);
        
        // Handle error responses
        if (response?.success === false) {
          console.error('Error in getCarsByOwnerId response:', response);
          return [];
        }
        
        // If response is an array, return it directly
        if (Array.isArray(response)) {
          console.log('Returning array of', response.length, 'cars');
          return response;
        }
        
        // If response has a data property that's an array, return that
        if (response?.data && Array.isArray(response.data)) {
          console.log('Returning data array of', response.data.length, 'cars');
          return response.data;
        }
        
        // If we have a single car object, return it in an array
        if (response && typeof response === 'object' && response.id) {
          console.log('Returning single car in array');
          return [response];
        }
        
        console.log('No valid cars data found in response, returning empty array');
        return [];
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error('Error in getCarsByOwnerId for owner', arg, ':', response);
        return response;
      },
      providesTags: (result = [], error, ownerId) => {
        console.log('getCarsByOwnerId providesTags for owner', ownerId, 'result:', result);
        
        // Ensure result is an array
        const resultArray = Array.isArray(result) ? result : [];
        
        // Return tags for each car plus a list tag
        return [
          ...resultArray.map(({ id }) => ({ type: 'Cars', id })),
          { type: 'Cars', id: 'OWNER_LIST' },
        ];
      },
    }),
    
    // Add a new car
    addCar: builder.mutation({
      query: (formData) => {
        // Note: Don't set Content-Type header - let the browser set it with the correct boundary
        return {
          url: '/cars/create',
          method: 'POST',
          body: formData,
          // Don't stringify the body when using FormData
          prepareHeaders: (headers) => {
            // Remove the default content-type header for FormData
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      invalidatesTags: [{ type: 'Cars', id: 'LIST' }, { type: 'Cars', id: 'OWNER_LIST' }],
    }),
    
    // Update a car
    updateCar: builder.mutation({
      query: ({ id, ...carData }) => ({
        url: `/cars/${id}`,
        method: 'PUT',
        body: carData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Cars', id },
        { type: 'Cars', id: 'LIST' },
        { type: 'Cars', id: 'OWNER_LIST' },
      ],
    }),
    
    // Delete a car
    deleteCar: builder.mutation({
      query: (id) => ({
        url: `/cars/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Cars', id },
        { type: 'Cars', id: 'LIST' },
        { type: 'Cars', id: 'OWNER_LIST' },
      ],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetFeaturedCarsQuery,
  useGetCarByIdQuery,
  useAddCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
  useGetCarsByOwnerIdQuery,
} = carsApi;

export default carsApi;
