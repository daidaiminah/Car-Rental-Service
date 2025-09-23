import { useState, useEffect } from 'react';
import API from '../config/api';

const useCarReviews = (carId) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    if (!carId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/reviews/car/${carId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch reviews');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch reviews');
      }

      // Process reviews to include car owner information
      const processedReviews = data.data.reviews.map(review => ({
        ...review,
        carOwner: review.carOwner || (review.car?.owner || null)
      }));

      setReviews(processedReviews || []);
      setAverageRating(data.data.averageRating || 0);
      setTotalReviews(data.data.totalReviews || 0);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [carId]);

  const addReview = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
    
    // Update average rating
    const newTotalRating = (averageRating * totalReviews + newReview.rating) / (totalReviews + 1);
    setAverageRating(newTotalRating);
    setTotalReviews(prev => prev + 1);
  };

  return {
    reviews,
    averageRating,
    totalReviews,
    isLoading,
    error,
    refreshReviews: fetchReviews,
    addReview
  };
};

export default useCarReviews;
