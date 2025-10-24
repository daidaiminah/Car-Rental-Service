import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiHeart,
} from 'react-icons/fi';
import { selectCurrentUser } from '../store/features/auth/authSlice';
import { useGetCarsQuery } from '../store/features/cars/carsApiSlice';
import { useGetRentalsByRenterIdQuery, useCreateRentalMutation } from '../store/features/rentals/rentalsApiSlice';
import { useGetWishlistQuery } from '../store/features/wishlist/wishlistApiSlice';
import CarCard from '../components/CarCard';
import CarDetailModal from '../components/CarDetailModal';
import NotificationBell from '../components/NotificationBell.jsx';

const StatCard = ({ title, value, subtitle, icon: Icon, accent = 'blue' }) => {
  const accentMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <article className="flex items-center justify-between rounded-lg bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
        )}
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${accentMap[accent]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </article>
  );
};

const safeNumber = (input) => {
  if (input === null || input === undefined) return 0;
  const numeric =
    typeof input === 'number'
      ? input
      : parseFloat(String(input).replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

const RenterDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [selectedCar, setSelectedCar] = useState(null);

  const {
    data: rentalsResponse,
    isLoading: rentalsLoading,
    refetch: refetchRentals,
  } = useGetRentalsByRenterIdQuery(user?.id, {
    skip: !user?.id,
  });

  const {
    data: wishlist = [],
    isLoading: wishlistLoading,
  } = useGetWishlistQuery(undefined, {
    skip: !user?.id,
  });

  const {
    data: carsResponse,
    isLoading: carsLoading,
  } = useGetCarsQuery({ status: 'available' });

  const rentals = useMemo(() => {
    const data = rentalsResponse?.data ?? rentalsResponse ?? [];
    return Array.isArray(data) ? data : [];
  }, [rentalsResponse]);

  const [createRental, { isLoading: isCreatingRental }] = useCreateRentalMutation();
  const recommendedCars = useMemo(() => {
    const raw = carsResponse?.data ?? carsResponse ?? [];
    return Array.isArray(raw) ? raw.slice(0, 6) : [];
  }, [carsResponse]);

  const today = useMemo(() => new Date(), []);


  const handleBookCar = async (bookingDetails) => {
    try {
      const rental = await createRental(bookingDetails).unwrap();
      await refetchRentals();
      return rental;
    } catch (error) {
      console.error('Error creating rental:', error);
      throw error;
    }
  };

  const stats = useMemo(() => {
    const upcomingTrips = rentals.filter((rental) => {
      if (!rental.startDate) return false;
      const start = new Date(rental.startDate);
      return (
        start >= today &&
        ['pending', 'confirmed', 'in_progress'].includes(rental.status)
      );
    }).length;

    const totalSpent = rentals
      .filter((rental) =>
        ['completed', 'confirmed'].includes(rental.status),
      )
      .reduce(
        (sum, rental) =>
          sum + safeNumber(rental.totalCost ?? rental.totalAmount ?? rental.payment?.amount),
        0,
      );

    return {
      totalBookings: rentals.length,
      upcomingTrips,
      totalSpent,
      wishlistCount: Array.isArray(wishlist) ? wishlist.length : 0,
    };
  }, [rentals, wishlist, today]);

  const upcomingRentals = useMemo(
    () =>
      rentals
        .filter((rental) => {
          if (!rental.startDate) return false;
          const start = new Date(rental.startDate);
          return start >= today;
        })
        .sort(
          (a, b) =>
            new Date(a.startDate || 0).getTime() -
            new Date(b.startDate || 0).getTime(),
        ),
    [rentals, today],
  );

  if (!user) {
    return (
      <div className="py-16 text-center text-gray-600">
        Sign in to view your renter dashboard.
      </div>
    );
  }

  const loading = rentalsLoading || wishlistLoading || carsLoading;

  const handleBookingConfirmation = async () => {
    await refetchRentals();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Renter Dashboard</h1>
          <p className="text-sm text-gray-500">
            View your bookings, plan upcoming trips, and explore new rides.
          </p>
        </div>
        <NotificationBell />
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={loading ? '...' : stats.totalBookings}
          subtitle="All-time reservations"
          icon={FiCalendar}
          accent="blue"
        />
        <StatCard
          title="Upcoming Trips"
          value={loading ? '...' : stats.upcomingTrips}
          subtitle="Scheduled rentals"
          icon={FiClock}
          accent="green"
        />
        <StatCard
          title="Total Spent"
          value={loading ? '...' : `$${stats.totalSpent.toFixed(2)}`}
          subtitle="Completed bookings"
          icon={FiDollarSign}
          accent="orange"
        />
        <StatCard
          title="Saved Cars"
          value={loading ? '...' : stats.wishlistCount}
          subtitle="Your wishlist"
          icon={FiHeart}
          accent="pink"
        />
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Reservations
          </h2>
          {upcomingRentals.length > 0 && (
            <span className="text-xs font-medium text-gray-400">
              {upcomingRentals.length} scheduled
            </span>
          )}
        </div>
        {loading ? (
          <p className="text-sm text-gray-500">Loading reservations...</p>
        ) : upcomingRentals.length === 0 ? (
          <p className="text-sm text-gray-500">
            You have no upcoming trips. Start by booking a car below.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Car
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Dates
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcomingRentals.slice(0, 6).map((rental) => {
                  const car = rental.car ?? {};
                  const amount = safeNumber(
                    rental.totalCost ?? rental.totalAmount ?? rental.payment?.amount,
                  );
                  return (
                    <tr key={rental.id}>
                      <td className="px-4 py-3 text-gray-900">
                        {car.make} {car.model}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {rental.startDate
                          ? format(new Date(rental.startDate), 'MMM d, yyyy')
                          : 'N/A'}{' '}
                        &ndash;{' '}
                        {rental.endDate
                          ? format(new Date(rental.endDate), 'MMM d, yyyy')
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-600">
                        {rental.status}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        ${amount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recommended Cars
          </h2>
          <Link
            to="/cars"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            Browse all cars
          </Link>
        </div>

        {carsLoading ? (
          <p className="text-sm text-gray-500">Loading cars...</p>
        ) : recommendedCars.length === 0 ? (
          <p className="text-sm text-gray-500">
            No cars available at the moment. Please check back later.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendedCars.map((car) => (
              <div
                key={car.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedCar(car)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedCar(car);
                  }
                }}
                className="text-left outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onBook={handleBookCar}
        />
      )}
    </div>
  );
};

export default RenterDashboard;
