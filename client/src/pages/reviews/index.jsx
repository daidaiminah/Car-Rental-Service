import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/authContext';
import { toast } from 'react-toastify';
import { StarIcon } from '@heroicons/react/24/solid';

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    carId: ''
  });
  const [userCars, setUserCars] = useState([]);

  useEffect(() => {
    // Fetch user's rented cars
    const fetchUserCars = async () => {
      try {
        // TODO: Replace with actual API call to fetch user's rented cars
        // const response = await fetch('/api/cars/rented');
        // const data = await response.json();
        // setUserCars(data);
        
        // Mock data for now
        setUserCars([
          { id: '1', name: 'Toyota Camry', plateNumber: 'KCA 123A' },
          { id: '2', name: 'Honda Civic', plateNumber: 'KCB 456B' },
        ]);
      } catch (error) {
        console.error('Error fetching user cars:', error);
        toast.error('Failed to load your rented cars');
      }
    };

    // Fetch user's reviews
    const fetchReviews = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/reviews');
        // const data = await response.json();
        // setReviews(data);
        
        // Mock data for now
        setReviews([
          {
            id: 1,
            car: { name: 'Toyota Camry' },
            rating: 5,
            comment: 'Great car, very comfortable!',
            createdAt: '2023-06-15',
          },
        ]);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCars();
    fetchReviews();
  }, [user?.id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.carId) {
      toast.error('Please select a car to review');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Please enter your review comment');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newReview),
      // });
      // const data = await response.json();
      
      // Mock success response
      const mockResponse = {
        id: Date.now(),
        car: userCars.find(car => car.id === newReview.carId),
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setReviews([mockResponse, ...reviews]);
      setNewReview({
        rating: 5,
        comment: '',
        carId: ''
      });
      
      toast.success('Thank you for your review!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Reviews</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Review form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
            
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="car">
                  Select Car
                </label>
                <select
                  id="car"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={newReview.carId}
                  onChange={(e) => setNewReview({...newReview, carId: e.target.value})}
                  required
                >
                  <option value="">-- Select a car --</option>
                  {userCars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name} ({car.plateNumber})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`${
                        star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                      } h-8 w-8 focus:outline-none`}
                      onClick={() => setNewReview({...newReview, rating: star})}
                      aria-label={`Rate ${star} out of 5`}
                    >
                      <StarIcon className="h-6 w-6" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="comment">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Share your experience with this car..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
        
        {/* Right column - Reviews list */}
        <div className="lg:col-span-2">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">You haven't written any reviews yet.</p>
              <p className="text-gray-400 text-sm mt-2">Rent a car and share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{review.car?.name}</h3>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
