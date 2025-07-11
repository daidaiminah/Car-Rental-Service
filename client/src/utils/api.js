import axios from 'axios';
import { getAuthToken } from './auth';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Update this with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Return the response data directly for easier handling
    if (response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle common errors here (e.g., 401 Unauthorized)
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized error (e.g., redirect to login)
        console.error('Authentication required');
      }
      // Return the error response data if available
      return Promise.reject({
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
      });
    } else {
      // Something happened in setting up the request
      return Promise.reject({
        message: error.message || 'An error occurred',
      });
    }
  }
);

export default api;
