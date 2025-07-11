import db from "../models/index.js";
import { Op } from 'sequelize';

const Rental = db.Rental;
const Car = db.Car;
const User = db.User;

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
    const { carId, startDate, endDate } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware
    
    // Validate required fields
    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Car ID, start date, and end date are required fields" 
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

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found`
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

    // Check if car is already booked for the selected dates
    const existingRental = await Rental.findOne({
      where: {
        carId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [start, end]
            }
          },
          {
            endDate: {
              [Op.between]: [start, end]
            }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: start } },
              { endDate: { [Op.gte]: end } }
            ]
          }
        ],
        status: {
          [Op.notIn]: ['cancelled', 'completed']
        }
      }
    });

    if (existingRental) {
      return res.status(400).json({
        success: false,
        message: "Car is not available for the selected dates"
      });
    }

    // Calculate number of days and total cost
    const days = calculateDays(startDate, endDate);
    const totalCost = days * car.rentalPricePerDay;

    // Create the rental record
    const newRental = await Rental.create({
      carId,
      userId,
      startDate: start,
      endDate: end,
      totalCost,
      status: 'pending',
      paymentStatus: 'pending'
    });

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

// Get all rentals for the current user
export const getMyRentals = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const rentals = await Rental.findAll({
      where: { userId },
      include: [
        { 
          model: Car, 
          as: "car",
          attributes: ['id', 'make', 'model', 'year', 'image', 'type']
        }
      ],
      order: [['createdAt', 'DESC']]
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
      message: "Failed to retrieve your rentals",
      error: error.message
    });
  }
};

// Get available cars for a date range
export const getAvailableCars = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find all cars that are not rented during the selected period
    const rentedCars = await Rental.findAll({
      where: {
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [start, end]
            }
          },
          {
            endDate: {
              [Op.between]: [start, end]
            }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: start } },
              { endDate: { [Op.gte]: end } }
            ]
          }
        ],
        status: {
          [Op.notIn]: ['cancelled', 'completed']
        }
      },
      attributes: ['carId']
    });

    const rentedCarIds = rentedCars.map(rental => rental.carId);

    // Get all cars that are not in the rented cars list
    const availableCars = await Car.findAll({
      where: {
        id: {
          [Op.notIn]: rentedCarIds
        },
        isAvailable: true
      },
      attributes: ['id', 'make', 'model', 'year', 'type', 'rentalPricePerDay', 'image', 'seats', 'transmission', 'fuelType']
    });

    return res.status(200).json({
      success: true,
      count: availableCars.length,
      data: availableCars
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve available cars",
      error: error.message
    });
  }
};

// Get rental by ID for the current user
export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const rental = await Rental.findOne({
      where: { 
        id,
        userId 
      },
      include: [
        { 
          model: Car, 
          as: "car",
          attributes: ['id', 'make', 'model', 'year', 'image', 'type']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: `Rental with ID ${id} not found or you don't have permission to view it`
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
// Get rentals for cars owned by the current user
export const getOwnerRentals = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    // First, get all cars owned by this user
    const ownerCars = await Car.findAll({
      where: { ownerId }
    });
    
    if (!ownerCars || ownerCars.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    // Get the car IDs
    const carIds = ownerCars.map(car => car.id);
    
    // Find all rentals for these cars
    const rentals = await Rental.findAll({
      where: {
        carId: {
          [Op.in]: carIds
        }
      },
      include: [
        { 
          model: Car, 
          as: "car",
          attributes: ['id', 'make', 'model', 'year', 'image', 'type', 'ownerId']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'] // Only include non-sensitive user information
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Double-check that all returned rentals are for cars owned by this user
    // This is a secondary security measure
    const validRentals = rentals.filter(rental => 
      rental.car && rental.car.ownerId === ownerId
    );
    
    return res.status(200).json({
      success: true,
      count: validRentals.length,
      data: validRentals
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve rentals for your cars",
      error: error.message
    });
  }
};

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
