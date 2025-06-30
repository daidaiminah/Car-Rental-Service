import api from './api.js';

const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    try {
      console.log('Fetching customers from API...');
      const response = await api.get('/customers');
      console.log('API Response:', response);
      
      // Ensure we have valid data
      if (!response) {
        throw new Error('No response received from server');
      }
      
      // Return the data array or an empty array if invalid
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Return empty array instead of throwing to prevent unhandled promise rejections
      console.log('Returning empty array due to error');
      return [];
    }
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new customer
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update an existing customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a customer
  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting customer with id ${id}:`, error);
      throw error;
    }
  }
};

export default customerService;
