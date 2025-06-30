import db from "../models/index.js";

const Car = db.Car;

// Create a new car
export const createCar = async (req, res) => {
  try {
    const { make, model, year, rentalPricePerDay } = req.body;
    
    // Validate required fields
    if (!make || !model || !year || !rentalPricePerDay) {
      return res.status(400).json({ 
        success: false, 
        message: "Make, model, year, and rental price are required fields" 
      });
    }

    // Create new car record
    const newCar = await Car.create({
      make,
      model,
      year,
      rentalPricePerDay,
      isAvailable: true
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
    const cars = await Car.findAll();
    
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
