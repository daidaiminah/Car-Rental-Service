const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export default {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  
  // Car endpoints
  CARS: {
    BASE: `${API_BASE_URL}/cars`,
    FEATURED: `${API_BASE_URL}/cars/featured`,
    SEARCH: `${API_BASE_URL}/cars/search`,
  },
  
  // Review endpoints
  REVIEWS: {
    BASE: `${API_BASE_URL}/reviews`,
    CAR_REVIEWS: (carId) => `${API_BASE_URL}/reviews/car/${carId}`,
  },
  
  // Rental endpoints
  RENTALS: {
    BASE: `${API_BASE_URL}/rentals`,
    USER_RENTALS: (userId) => `${API_BASE_URL}/rentals/user/${userId}`,
  },
  
  // User endpoints
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    PROFILE: (userId) => `${API_BASE_URL}/users/${userId}`,
  },
  
  // Payment endpoints
  PAYMENTS: {
    BASE: `${API_BASE_URL}/payments`,
    CREATE_SESSION: `${API_BASE_URL}/payments/create-checkout-session`,
  },
};
