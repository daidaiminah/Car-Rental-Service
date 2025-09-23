import db from "../models/index.js";

const Review = db.Review;
const User = db.User;

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { rating, comment, carId, rentalId } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!rating || !carId || !rentalId) {
      return res.status(400).json({
        success: false,
        message: 'Rating, car ID, and rental ID are required fields'
      });
    }

    // Check if the user has completed the rental
    const rental = await db.Rental.findOne({
      where: {
        id: rentalId,
        userId,
        status: 'completed'
      }
    });

    if (!rental) {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed rentals'
      });
    }

    // Check if the user has already reviewed this rental
    const existingReview = await Review.findOne({
      where: {
        userId,
        rentalId
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this rental'
      });
    }

    // Create the review
    const review = await Review.create({
      rating,
      comment,
      userId,
      carId,
      rentalId
    });

    // Include user details in the response
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'profileImage']
    });

    return res.status(201).json({
      success: true,
      data: {
        ...review.get({ plain: true }),
        user
      }
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Get reviews for a car
export const getCarReviews = async (req, res) => {
  try {
    const { carId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { carId },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'profileImage']
        },
        {
          model: db.Car,
          as: 'car',
          attributes: ['id', 'ownerId'],
          include: [{
            model: db.User,
            as: 'owner',
            attributes: ['id', 'name', 'profileImage']
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // Format the response to include the car owner's details
    const formattedReviews = reviews.map(review => ({
      ...review.get({ plain: true }),
      carOwner: review.car?.owner || null
    }));

    // Calculate average rating
    const avgRating = await Review.findOne({
      where: { carId },
      attributes: [
        [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'averageRating']
      ],
      raw: true
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: {
        reviews: formattedReviews,
        pagination: {
          total: count,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        },
        averageRating: parseFloat(avgRating.averageRating) || 0,
        totalReviews: count
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: {
        id,
        userId
      }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you do not have permission to delete it'
      });
    }

    await review.destroy();

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};
