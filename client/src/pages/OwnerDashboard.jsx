import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
} from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import { selectCurrentUser } from '../store/features/auth/authSlice';
import { useGetCarsByOwnerIdQuery } from '../store/features/cars/carsApiSlice';
import { useGetRentalsByOwnerIdQuery } from '../store/features/rentals/rentalsApiSlice';
import NotificationBell from '../components/NotificationBell.jsx';

const StatCard = ({ title, value, subtitle, icon: Icon, accent = 'gray' }) => {
  const accentMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600',
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

const OwnerDashboard = () => {
  const user = useSelector(selectCurrentUser);

  const {
    data: carsResponse,
    isLoading: carsLoading,
  } = useGetCarsByOwnerIdQuery(user?.id, {
    skip: !user?.id,
  });

  const {
    data: rentalsResponse,
    isLoading: rentalsLoading,
  } = useGetRentalsByOwnerIdQuery(user?.id, {
    skip: !user?.id,
  });

  const cars = useMemo(() => {
    const data = carsResponse?.data ?? carsResponse ?? [];
    return Array.isArray(data) ? data : [];
  }, [carsResponse]);

  const rentals = useMemo(() => {
    const data = rentalsResponse?.data ?? rentalsResponse ?? [];
    return Array.isArray(data) ? data : [];
  }, [rentalsResponse]);

  const today = useMemo(() => new Date(), []);

  const stats = useMemo(() => {
    const totalRevenue = rentals.reduce(
      (sum, rental) =>
        sum + safeNumber(rental.totalCost ?? rental.amount ?? rental.payment?.amount),
      0,
    );

    const activeRentals = rentals.filter((rental) =>
      ['confirmed', 'in_progress'].includes(rental.status),
    ).length;

    const pendingRequests = rentals.filter(
      (rental) => rental.status === 'pending',
    ).length;

    const upcomingRentals = rentals.filter((rental) => {
      if (!rental.startDate) return false;
      const start = new Date(rental.startDate);
      return (
        start >= today &&
        ['pending', 'confirmed', 'in_progress'].includes(rental.status)
      );
    }).length;

    return {
      totalCars: cars.length,
      totalRevenue,
      activeRentals,
      pendingRequests,
      upcomingRentals,
    };
  }, [cars.length, rentals, today]);

  const latestRentals = useMemo(
    () =>
      [...rentals].sort(
        (a, b) =>
          new Date(b.createdAt || b.startDate || 0).getTime() -
          new Date(a.createdAt || a.startDate || 0).getTime(),
      ),
    [rentals],
  );

  if (!user) {
    return (
      <div className="py-16 text-center text-gray-600">
        Sign in to view your owner dashboard.
      </div>
    );
  }

  const loading = carsLoading || rentalsLoading;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-sm text-gray-500">
            Track fleet performance, bookings, and earnings in real time.
          </p>
        </div>
        <NotificationBell />
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Cars"
          value={loading ? '...' : stats.totalCars}
          subtitle="Vehicles currently listed"
          icon={FaCar}
          accent="blue"
        />
        <StatCard
          title="Active Rentals"
          value={loading ? '...' : stats.activeRentals}
          subtitle="Bookings in progress or confirmed"
          icon={FiBriefcase}
          accent="green"
        />
        <StatCard
          title="Pending Requests"
          value={loading ? '...' : stats.pendingRequests}
          subtitle="Awaiting your confirmation"
          icon={FiClock}
          accent="orange"
        />
        <StatCard
          title="Lifetime Revenue"
          value={loading ? '...' : `$${stats.totalRevenue.toFixed(2)}`}
          subtitle="Sum of completed and confirmed rentals"
          icon={FiDollarSign}
          accent="purple"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Rentals
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              <FiTrendingUp className="h-4 w-4" />
              {stats.upcomingRentals} scheduled
            </span>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500">Loading rentals...</p>
          ) : stats.upcomingRentals === 0 ? (
            <p className="text-sm text-gray-500">No upcoming rentals.</p>
          ) : (
            <ul className="space-y-4">
              {latestRentals
                .filter((rental) => {
                  if (!rental.startDate) return false;
                  const start = new Date(rental.startDate);
                  return (
                    start >= today &&
                    ['pending', 'confirmed', 'in_progress'].includes(rental.status)
                  );
                })
                .slice(0, 5)
                .map((rental) => {
                  const car = rental.car ?? cars.find((c) => c.id === rental.carId) ?? {};
                  const start = rental.startDate
                    ? format(new Date(rental.startDate), 'MMM d, yyyy')
                    : 'N/A';
                  const end = rental.endDate
                    ? format(new Date(rental.endDate), 'MMM d, yyyy')
                    : 'N/A';

                  return (
                    <li
                      key={rental.id}
                      className="flex items-start justify-between rounded-lg border border-gray-100 p-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {car.make} {car.model}
                        </p>
                        <p className="text-sm text-gray-500">
                          {start} &ndash; {end}
                        </p>
                        <p className="text-xs text-gray-400">
                          {rental.user?.name || 'Customer'}
                        </p>
                      </div>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {rental.status}
                      </span>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Fleet</h2>
            <Link
              to="/owner/cars"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Manage cars
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500">Loading cars...</p>
          ) : cars.length === 0 ? (
            <p className="text-sm text-gray-500">
              You have not listed any vehicles yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {cars.slice(0, 5).map((car) => (
                <li
                  key={car.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {car.year} {car.make} {car.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${safeNumber(car.rentalPricePerDay).toFixed(2)} / day &middot;{' '}
                      {car.type}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    Available
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Bookings
          </h2>
          {rentals.length > 5 && (
            <Link
              to="/owner/rentals"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              View all bookings
            </Link>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading bookings...</p>
        ) : rentals.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Car
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Dates
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {latestRentals.slice(0, 5).map((rental) => {
                  const car = rental.car ?? cars.find((c) => c.id === rental.carId) ?? {};
                  const amount = safeNumber(
                    rental.totalCost ?? rental.amount ?? rental.payment?.amount,
                  );
                  const start = rental.startDate
                    ? format(new Date(rental.startDate), 'MMM d, yyyy')
                    : 'N/A';
                  const end = rental.endDate
                    ? format(new Date(rental.endDate), 'MMM d, yyyy')
                    : 'N/A';

                  return (
                    <tr key={rental.id}>
                      <td className="px-4 py-3 text-gray-900">
                        {car.make} {car.model}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {rental.user?.name || 'Customer'}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {start} &ndash; {end}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        ${amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {rental.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default OwnerDashboard;
