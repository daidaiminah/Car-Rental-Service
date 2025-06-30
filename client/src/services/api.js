import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: '/api', // Using relative path to work with Vite proxy
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (e.g., token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // You could redirect to login page here if needed
    }
    return Promise.reject(error);
  }
);

export default api;
