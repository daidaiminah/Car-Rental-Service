import db from "../models/index.js";

const Rental = db.Rental;
const Car = db.Car;
const Customer = db.Customer;

// Helper function to calculate days between two dates
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

// Create a new rental
export const createRental = async (req, res) => {
  try {
    const { carId, customerId, startDate, endDate } = req.body;
    
    // Validate required fields
    if (!carId || !customerId || !startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Car ID, customer ID, start date, and end date are required fields" 
      });
    }

    // Check if car exists
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: `Car with ID ${carId} not found`
      });
    }

    // Check if car is available
    if (!car.isAvailable) {
      return res.status(400).json({
        success: false,
        message: `Car with ID ${carId} is not available for rent`
      });
    }

    // Check if customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${customerId} not found`
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (start < today) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past"
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date"
      });
    }

    // Calculate number of days and total cost
    const days = calculateDays(startDate, endDate);
    const totalCost = days * car.rentalPricePerDay;

    // Create the rental record
    const newRental = await Rental.create({
      carId,
      customerId,
      startDate,
      endDate,
      totalCost
    });

    // Update car availability
    await car.update({ isAvailable: false });

    return res.status(201).json({
      success: true,
      message: "Rental created successfully",
      data: {
        ...newRental.dataValues,
        days,
        dailyRate: car.rentalPricePerDay
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create rental",
      error: error.message
    });
  }
};

// Get all rentals
export const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.findAll({
      include: [
        { model: Car, as: "car" },
        { model: Customer, as: "customer" }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve rentals",
      error: error.message
    });
  }
};

// Get rental by ID
export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByPk(id, {
      include: [
        { model: Car, as: "car" },
        { model: Customer, as: "customer" }
      ]
    });
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: `Rental with ID ${id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: rental
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve rental",
      error: error.message
    });
  }
};

// Delete rental (cancel)
export const deleteRental = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if rental exists
    const rental = await Rental.findByPk(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: `Rental with ID ${id} not found`
      });
    }

    // Check if rental can be canceled (only if start date is in the future)
    const startDate = new Date(rental.startDate);
    const today = new Date();
    
    if (startDate <= today) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a rental that has already started"
      });
    }

    // Make car available again
    await Car.update(
      { isAvailable: true },
      { where: { id: rental.carId } }
    );

    // Delete rental
    await rental.destroy();

    return res.status(200).json({
      success: true,
      message: "Rental canceled successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel rental",
      error: error.message
    });
  }
};
