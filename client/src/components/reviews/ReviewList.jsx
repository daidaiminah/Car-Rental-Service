import React from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const ReviewList = ({ reviews, averageRating, totalReviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        No reviews yet. Be the first to leave a review!
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center">
          <div className="text-4xl font-bold mr-4">{averageRating.toFixed(1)}</div>
          <div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`${
                    star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                  } w-6 h-6`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {review.user?.profileImage ? (
                  <img
                    src={review.user.profileImage}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {review.user?.name || 'Anonymous User'}
                    </h4>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`${
                            star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                          } w-4 h-4`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
