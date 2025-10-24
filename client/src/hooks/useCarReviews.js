import { useMemo } from 'react';
import { useGetCarReviewsQuery } from '../store/features/reviews/reviewsApiSlice';

const useCarReviews = (carId) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetCarReviewsQuery(carId, {
    skip: !carId,
  });

  const reviews = useMemo(() => data?.reviews ?? [], [data]);
  const averageRating = data?.averageRating ?? 0;
  const totalReviews = data?.totalReviews ?? 0;

  return {
    reviews,
    averageRating,
    totalReviews,
    isLoading,
    error,
    refreshReviews: refetch,
  };
};

export default useCarReviews;
