import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCreateReviewMutation } from '../../store/features/reviews/reviewsApiSlice';

const ReviewForm = ({ carId, rentalId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!rentalId) {
      toast.error('You can only review cars you have completed a rental for.');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      const review = await createReview({
        rating,
        comment,
        carId,
        rentalId,
      }).unwrap();

      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');

      onReviewSubmitted?.(review?.data ?? review);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => {
              const ratingValue = star;
              return (
                <button
                  key={star}
                  type="button"
                  className={`${
                    ratingValue <= (hover || rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  } w-8 h-8 focus:outline-none`}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  <FaStar className="w-6 h-6" />
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Review (optional)
          </label>
          <textarea
            id="comment"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your experience with this car..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading || !rentalId}
            className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isLoading || !rentalId
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
