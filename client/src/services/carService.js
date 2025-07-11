import api from './api.js';

const carService = {
  // Get all cars with optional filters
  getAllCars: async (filters = {}) => {
    try {
      console.log('Fetching cars from API with filters:', filters);
      const { type, minPrice, maxPrice, search, limit } = filters;
      
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (search) params.append('search', search);
      if (limit) params.append('limit', limit);
      
      const response = await api.get(`/cars?${params.toString()}`);
      
      // Ensure we have valid data
      if (!response || !response.data) {
        console.error('Invalid response format from server');
        return [];
      }
      
      // Transform the data to match the expected format
      const cars = Array.isArray(response.data) 
        ? response.data 
        : response.data.data || [];
      
      return cars.map(car => ({
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        pricePerDay: car.rentalPricePerDay,
        type: car.type,
        transmission: car.transmission,
        seats: car.seats,
        fuelType: car.fuelType,
        description: car.description,
        image: car.imageUrl,
        rating: car.rating,
        location: car.location,
        available: car.isAvailable
      }));
    } catch (error) {
      console.error('Error fetching cars:', error);
      // Return empty array instead of throwing to prevent unhandled promise rejections
      return [];
    }
  },
  
  // Get featured cars (first 6 cars by default)
  getFeaturedCars: async (limit = 6) => {
    return carService.getAllCars({ limit });
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
