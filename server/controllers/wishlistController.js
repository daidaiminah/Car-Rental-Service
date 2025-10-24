import db from '../models/index.js';
import { emitToUser } from '../socket/index.js';

const Wishlist = db.Wishlist;
const Car = db.Car;

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Car,
          as: 'car',
          attributes: [
            'id',
            'make',
            'model',
            'year',
            'rentalPricePerDay',
            'imageUrl',
            'type',
            'seats',
            'fuelType',
            'transmission',
            'location',
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load wishlist',
      error: error.message,
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId, notes } = req.body;

    if (!carId) {
      return res.status(400).json({
        success: false,
        message: 'carId is required',
      });
    }

    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    const [wishlistItem, created] = await Wishlist.findOrCreate({
      where: { userId, carId },
      defaults: { notes },
      include: [{ model: Car, as: 'car' }],
    });

    if (!created && notes !== undefined) {
      wishlistItem.notes = notes;
      await wishlistItem.save();
    }

    const itemWithCar = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Car,
          as: 'car',
          attributes: [
            'id',
            'make',
            'model',
            'year',
            'rentalPricePerDay',
            'imageUrl',
            'type',
            'seats',
            'fuelType',
            'transmission',
            'location',
          ],
        },
      ],
    });

    emitToUser(userId, 'wishlist:updated', {
      action: created ? 'added' : 'updated',
      item: itemWithCar,
    });

    return res.status(created ? 201 : 200).json({
      success: true,
      data: itemWithCar,
      created,
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update wishlist',
      error: error.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId } = req.params;

    if (!carId) {
      return res.status(400).json({
        success: false,
        message: 'carId parameter is required',
      });
    }

    const removed = await Wishlist.destroy({
      where: { userId, carId },
    });

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found',
      });
    }

    emitToUser(userId, 'wishlist:updated', {
      action: 'removed',
      carId,
    });

    return res.status(200).json({
      success: true,
      message: 'Removed from wishlist',
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: error.message,
    });
  }
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
