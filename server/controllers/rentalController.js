import db from "../models/index.js";
import { Op } from 'sequelize';
import { sendNotification } from '../utils/notificationService.js';

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
    const { carId, startDate, endDate, pickupAddress, pickupLocation, dropoffLocation } = req.body;
    
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const userId = req.user.id;
    
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

    // Normalize pickup/dropoff locations using whichever field the client provided
    const resolvedPickupLocation = pickupLocation || pickupAddress || 'Not specified';
    const resolvedDropoffLocation = dropoffLocation || pickupAddress || 'Same as pickup';

    // Calculate number of days and total cost
    const totalDays = calculateDays(startDate, endDate);
    const totalCost = car.rentalPricePerDay * totalDays;

    // Use a transaction to ensure the rental is created before we proceed
    const result = await db.sequelize.transaction(async (t) => {
      const rental = await Rental.create({
      carId,
      userId,
      startDate: start,
      endDate: end,
      totalCost,
      status: 'pending',
      paymentStatus: 'pending',
      totalDays,
      dailyRate: car.rentalPricePerDay,
      pickupLocation: resolvedPickupLocation,
      dropoffLocation: resolvedDropoffLocation,
      paymentMethod: req.body.paymentMethod || 'credit_card'
    }, { transaction: t });

      // Notify car owner about the new rental request
      try {
        const owner = await User.findByPk(car.ownerId, { transaction: t });
        if (owner) {
          await sendNotification({
            userId: owner.id,
            title: 'New Rental Request',
            message: `You have a new rental request for your ${car.make} ${car.model}`,
            type: 'rental_request',
            data: {
              rentalId: rental.id,
              carId: car.id,
              requesterId: user.id,
              startDate: start,
              endDate: end
            }
          });
        }
      } catch (error) {
        console.error('Error sending notification within transaction:', error);
        // Do not re-throw, as we don't want to fail the rental creation for a notification failure
      }

      return rental;
    });

    // The transaction has been committed. 'result' is the rental instance.
    const rental = result;


    return res.status(201).json({
      success: true,
      message: "Rental created successfully",
      data: {
        ...rental.dataValues,
        totalDays,
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

// Get all rentals for a user (either current user or specified user ID)
export const getMyRentals = async (req, res) => {
  try {
    // Use the userId from params if provided, otherwise use the authenticated user's ID
    const userId = req.params.userId || req.user.id;
    
    const rentals = await Rental.findAll({
      where: { userId },
      include: [
        { 
          model: Car, 
          as: "car",
            attributes: ['id', 'make', 'model', 'year', 'imageUrl', 'type', 'seats', 'rentalPricePerDay']
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
      attributes: ['id', 'make', 'model', 'year', 'type', 'rentalPricePerDay', 'imageUrl', 'seats', 'transmission', 'fuelType']
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
            attributes: ['id', 'make', 'model', 'year', 'imageUrl', 'type', 'seats', 'rentalPricePerDay']
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
// Get rentals for cars owned by a specific owner
// Can be called with JWT (current user) or with ownerId parameter
export const getOwnerRentals = async (req, res) => {
  try {
    console.log('=== GET OWNER RENTALS ===');
    console.log('Request params:', req.params);
    console.log('Request user:', req.user);
    
    // Get ownerId from URL params or JWT
    const ownerId = req.params.ownerId || (req.user && req.user.id);
    
    // Get query parameters
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    console.log('Owner ID:', ownerId, 'Status filter:', status, 'Page:', page, 'Limit:', limit);
    
    if (!ownerId) {
      console.error('No owner ID found in request');
      return res.status(400).json({
        success: false,
        message: 'Owner ID is required',
        details: 'No owner ID provided in URL params or JWT token',
        requestParams: req.params,
        requestUser: req.user ? 'User exists in request' : 'No user in request'
      });
    }
    
    // Use the ownerId directly (it's a UUID string)
    const ownerIdToUse = ownerId;
    
    // Validate UUID format (optional but recommended)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(ownerIdToUse)) {
      console.error('Invalid owner ID format (expected UUID):', ownerIdToUse);
      return res.status(400).json({
        success: false,
        message: 'Invalid owner ID format',
        expectedFormat: 'UUID',
        received: ownerIdToUse
      });
    }
    
    // Find all cars owned by this user
    console.log('Finding cars for owner ID:', ownerIdToUse);
    const { count: totalCars, rows: ownerCars } = await Car.findAndCountAll({
      where: { ownerId: ownerIdToUse },
      attributes: ['id'],
      raw: true
    }).catch(err => {
      console.error('Error finding cars:', err);
      throw new Error(`Failed to find cars for owner: ${err.message}`);
    });
    
    console.log(`Found ${totalCars} cars for owner ${ownerIdToUse}`);
    
    if (totalCars === 0) {
      console.log('No cars found for owner, returning empty array');
      return res.status(200).json({
        success: true,
        count: 0,
        totalPages: 0,
        currentPage: parseInt(page, 10),
        data: []
      });
    }
    
    // Get the car IDs
    const carIds = ownerCars.map(car => car.id);
    
    // Build where clause for rentals
    const rentalWhere = {
      carId: { [Op.in]: carIds }
    };
    
    // Add status filter if provided
    if (status && ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      rentalWhere.status = status;
    }
    
    // Find all rentals for these cars with pagination
    console.log('Finding rentals for car IDs:', carIds);
    console.log('Rental where clause:', JSON.stringify(rentalWhere, null, 2));
    
    const { count: totalRentals, rows: rentals } = await Rental.findAndCountAll({
      where: rentalWhere,
      include: [
        { 
          model: Car, 
          as: "car",
          attributes: ['id', 'make', 'model', 'year', 'imageUrl', 'type', 'seats', 'rentalPricePerDay', 'ownerId'],
          required: true
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'profileImage'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit, 10),
      offset: offset,
      distinct: true,
      logging: console.log // Log the SQL query
    }).catch(err => {
      console.error('Error finding rentals:', err);
      throw new Error(`Failed to find rentals: ${err.message}`);
    });
    
    console.log(`Found ${rentals.length} rentals out of ${totalRentals} total`);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalRentals / limit);
    
    return res.status(200).json({
      success: true,
      count: rentals.length,
      total: totalRentals,
      totalPages: totalPages,
      currentPage: parseInt(page),
      data: rentals
    });
  } catch (error) {
    console.error('Error in getOwnerRentals:', error);
    console.error('Error stack:', error.stack);
    
    // Check for specific error types
    if (error.name === 'SequelizeDatabaseError') {
      console.error('Database error details:', {
        message: error.message,
        sql: error.sql,
        parameters: error.parameters
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve rentals for your cars",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

// Update rental status (confirm/reject/cancel)
export const updateRentalStatus = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { rentalId } = req.params;
    const { status, rejectionReason } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find the rental with car and user details
    const rental = await Rental.findOne({
      where: { id: rentalId },
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'ownerId', 'make', 'model']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      transaction
    });

    if (!rental) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Check if user has permission (must be owner or admin)
    if (rental.car.ownerId !== userId && !req.user.isAdmin) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this rental'
      });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'rejected', 'cancelled'],
      'confirmed': ['completed', 'cancelled'],
      'rejected': [],
      'cancelled': [],
      'completed': []
    };

    if (!validTransitions[rental.status].includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${rental.status} to ${status}`
      });
    }

    // Store old status for notification
    const oldStatus = rental.status;
    
    // Update rental status
    rental.status = status;
    
    // Add rejection reason if provided
    if (status === 'rejected' && rejectionReason) {
      rental.rejectionReason = rejectionReason;
    }
    
    // Update payment status if needed
    if (status === 'confirmed') {
      rental.paymentStatus = 'paid';
    } else if (status === 'cancelled') {
      rental.paymentStatus = 'refunded';
    }
    
    await rental.save({ transaction });

    // If confirmed, mark car as unavailable during rental period
    if (status === 'confirmed') {
      // Here you would typically implement actual car availability logic
      console.log(`Car ${rental.carId} marked as booked from ${rental.startDate} to ${rental.endDate}`);
    }

    // Notify the renter about the status update
    try {
      let notificationTitle = '';
      let notificationMessage = '';
      
      switch (status) {
        case 'confirmed':
          notificationTitle = 'Rental Confirmed';
          notificationMessage = `Your rental for ${rental.car.make} ${rental.car.model} has been confirmed!`;
          break;
        case 'rejected':
          notificationTitle = 'Rental Rejected';
          notificationMessage = `Your rental request for ${rental.car.make} ${rental.car.model} has been rejected.`;
          if (rejectionReason) {
            notificationMessage += ` Reason: ${rejectionReason}`;
          }
          break;
        case 'cancelled':
          notificationTitle = 'Rental Cancelled';
          notificationMessage = `Your rental for ${rental.car.make} ${rental.car.model} has been cancelled.`;
          break;
        case 'completed':
          notificationTitle = 'Rental Completed';
          notificationMessage = `Your rental for ${rental.car.make} ${rental.car.model} has been marked as completed.`;
          break;
      }

      if (notificationTitle && notificationMessage) {
        await sendNotification({
          userId: rental.userId,
          title: notificationTitle,
          message: notificationMessage,
          type: 'rental_status_update',
          data: {
            rentalId: rental.id,
            status: rental.status,
            carId: rental.carId,
            oldStatus,
            rejectionReason: status === 'rejected' ? rejectionReason : undefined
          }
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      // Don't fail the request if notification fails
    }

    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: `Rental ${status} successfully`,
      data: rental
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error in updateRentalStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating rental status',
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
