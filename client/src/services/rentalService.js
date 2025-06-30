import api from './api.js';

const rentalService = {
  // Get all rentals
  getAllRentals: async () => {
    try {
      console.log('Fetching rentals from API...');
      const response = await api.get('/rentals');
      console.log('Rentals API Response:', response);
      
      // Ensure we have valid data
      if (!response) {
        console.error('No response received from server');
        return [];
      }
      
      // Return the data array or an empty array if invalid
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching rentals:', error);
      // Return empty array instead of throwing to prevent unhandled promise rejections
      return [];
    }
  },

  // Get rental by ID
  getRentalById: async (id) => {
    try {
      const response = await api.get(`/rentals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rental with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new rental
  createRental: async (rentalData) => {
    try {
      const response = await api.post('/rentals', rentalData);
      return response.data;
    } catch (error) {
      console.error('Error creating rental:', error);
      throw error;
    }
  },

  // Update an existing rental
  updateRental: async (id, rentalData) => {
    try {
      const response = await api.put(`/rentals/${id}`, rentalData);
      return response.data;
    } catch (error) {
      console.error(`Error updating rental with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a rental
  deleteRental: async (id) => {
    try {
      const response = await api.delete(`/rentals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting rental with id ${id}:`, error);
      throw error;
    }
  },
  
  // Get rentals by customer ID
  getRentalsByCustomerId: async (customerId) => {
    try {
      const response = await api.get(`/rentals?customerId=${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rentals for customer ${customerId}:`, error);
      throw error;
    }
  },
  
  // Get rentals by car ID
  getRentalsByCarId: async (carId) => {
    try {
      const response = await api.get(`/rentals?carId=${carId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rentals for car ${carId}:`, error);
      throw error;
    }
  }
};

export default rentalService;
