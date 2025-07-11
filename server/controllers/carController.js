import db from "../models/index.js";

const Car = db.Car;

// Create a new car
export const createCar = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      rentalPricePerDay,
      type,
      transmission,
      seats,
      fuelType,
      description,
      imageUrl,
      rating,
      location
    } = req.body;
    
    // Validate required fields
    if (!make || !model || !year || !rentalPricePerDay || !type || !transmission || !seats || !fuelType) {
      return res.status(400).json({ 
        success: false, 
        message: "Make, model, year, rental price, type, transmission, seats, and fuel type are required fields" 
      });
    }

    // Create new car record
    const newCar = await Car.create({
      make,
      model,
      year,
      rentalPricePerDay,
      isAvailable: true,
      type,
      transmission,
      seats,
      fuelType,
      description: description || 'This is a well-maintained vehicle in excellent condition, ready for your next adventure.',
      imageUrl,
      rating: rating || 4.5,
      location: location || 'Not specified'
    });

    return res.status(201).json({
      success: true,
      message: "Car created successfully",
      data: newCar
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create car",
      error: error.message
    });
  }
};

// Get all cars
export const getAllCars = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, search, limit = 10 } = req.query;
    
    const whereClause = {};
    
    // Add filters if provided
    if (type) whereClause.type = type;
    if (minPrice) whereClause.rentalPricePerDay = { [db.Sequelize.Op.gte]: parseFloat(minPrice) };
    if (maxPrice) {
      whereClause.rentalPricePerDay = {
        ...whereClause.rentalPricePerDay,
        [db.Sequelize.Op.lte]: parseFloat(maxPrice)
      };
    }
    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { make: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { model: { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }
    
    const cars = await Car.findAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      order: [['id', 'DESC']] // Changed from 'createdAt' to 'id' since createdAt might not exist
    });
    
    return res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve cars",
      error: error.message
    });
  }
};

// Get car by ID
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByPk(id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: `Car with ID ${id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve car",
      error: error.message
    });
  }
};

// Update car
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { make, model, year, rentalPricePerDay, isAvailable } = req.body;
    
    // Check if car exists
    const car = await Car.findByPk(id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: `Car with ID ${id} not found`
      });
    }

    // Update car
    await car.update({
      make: make || car.make,
      model: model || car.model,
      year: year || car.year,
      rentalPricePerDay: rentalPricePerDay || car.rentalPricePerDay,
      isAvailable: isAvailable !== undefined ? isAvailable : car.isAvailable
    });

    return res.status(200).json({
      success: true,
      message: "Car updated successfully",
      data: car
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update car",
      error: error.message
    });
  }
};

// Delete car
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if car exists
    const car = await Car.findByPk(id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: `Car with ID ${id} not found`
      });
    }

    // Delete car
    await car.destroy();

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete car",
      error: error.message
    });
  }
};
