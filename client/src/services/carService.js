import api from './api.js';

const carService = {
  // Get all cars
  getAllCars: async () => {
    try {
      console.log('Fetching cars from API...');
      const response = await api.get('/cars');
      console.log('Cars API Response:', response);
      
      // Ensure we have valid data
      if (!response) {
        console.error('No response received from server');
        return [];
      }
      
      // Return the data array or an empty array if invalid
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching cars:', error);
      // Return empty array instead of throwing to prevent unhandled promise rejections
      return [];
    }
  },

  // Get car by ID
  getCarById: async (id) => {
    try {
      const response = await api.get(`/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching car with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new car
  createCar: async (carData) => {
    try {
      const response = await api.post('/cars', carData);
      return response.data;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  },

  // Update an existing car
  updateCar: async (id, carData) => {
    try {
      const response = await api.put(`/cars/${id}`, carData);
      return response.data;
    } catch (error) {
      console.error(`Error updating car with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a car
  deleteCar: async (id) => {
    try {
      const response = await api.delete(`/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting car with id ${id}:`, error);
      throw error;
    }
  },
  
  // Get available cars (not currently rented)
  getAvailableCars: async () => {
    try {
      const response = await api.get('/cars?status=Available');
      return response.data;
    } catch (error) {
      console.error('Error fetching available cars:', error);
      throw error;
    }
  }
};

export default carService;
