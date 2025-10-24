import React, { useMemo, useState } from 'react';
import { useAuth } from '../../store/authContext';
import {
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiFilter,
  FiArrowUpRight,
} from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import { format, parseISO, subDays, isAfter, isSameDay } from 'date-fns';
import { useGetRentalsByOwnerIdQuery } from '../../store/features/rentals/rentalsApiSlice';

const safeNumber = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value).replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const TIME_RANGES = [
  { id: 'week', label: 'This Week', days: 7 },
  { id: 'month', label: 'This Month', days: 30 },
  { id: 'year', label: 'This Year', days: 365 },
  { id: 'all', label: 'All Time', days: null },
];

const getThresholdDate = (rangeId) => {
  if (rangeId === 'all') return null;
  const range = TIME_RANGES.find((item) => item.id === rangeId);
  if (!range?.days) return null;
  return subDays(new Date(), range.days);
};

const getRentalDate = (rental) => {
  if (rental?.startDate) return parseISO(rental.startDate);
  if (rental?.createdAt) return parseISO(rental.createdAt);
  return null;
};

const filterByRange = (rentals, rangeId) => {
  const threshold = getThresholdDate(rangeId);
  if (!threshold) return rentals;
  return rentals.filter((rental) => {
    const rentalDate = getRentalDate(rental);
    if (!rentalDate) return false;
    return isSameDay(rentalDate, new Date()) || isAfter(rentalDate, threshold);
  });
};

const buildChartData = (rentals, rangeId, totalEarnings) => {
  const buckets = new Map();

  rentals.forEach((rental) => {
    const date = getRentalDate(rental);
    if (!date) return;

    const amount = safeNumber(
      rental.totalCost ?? rental.amount ?? rental.payment?.amount
    );

    let label;
    let sortKey;

    switch (rangeId) {
      case 'week':
        label = format(date, 'EEE');
        sortKey = date.getDay();
        break;
      case 'month':
        label = format(date, 'dd MMM');
        sortKey = date.getDate();
        break;
      case 'year':
        label = format(date, 'MMM');
        sortKey = date.getMonth();
        break;
      default:
        label = format(date, 'MMM yyyy');
        sortKey = date.getFullYear() * 12 + date.getMonth();
    }

    const existing = buckets.get(label);
    if (existing) {
      existing.amount += amount;
    } else {
      buckets.set(label, { label, amount, sortKey });
    }
  });

  return Array.from(buckets.values())
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ label, amount }) => ({
      label,
      amount,
      percentage:
        totalEarnings > 0 ? Math.min(100, (amount / totalEarnings) * 100) : 0,
    }));
};

const buildCarBreakdown = (rentals) => {
  const totals = new Map();

  rentals.forEach((rental) => {
    const car = rental.car ?? {};
    const key = car.id || rental.carId;
    if (!key) return;

    const amount = safeNumber(
      rental.totalCost ?? rental.amount ?? rental.payment?.amount
    );

    const existing = totals.get(key) ?? {
      carId: key,
      name: `${car.make || ''} ${car.model || ''}`.trim() || 'Vehicle',
      imageUrl: car.imageUrl,
      total: 0,
      trips: 0,
    };

    existing.total += amount;
    existing.trips += 1;
    totals.set(key, existing);
  });

  return Array.from(totals.values()).sort((a, b) => b.total - a.total);
};

const Earnings = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');

  const {
    data: rentalsResponse,
    isLoading,
    isError,
    error,
  } = useGetRentalsByOwnerIdQuery(null, {
    skip: !user?.id,
    refetchOnMountOrArgChange: true,
  });

  const rentals = useMemo(() => {
    const raw = rentalsResponse?.data ?? rentalsResponse ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [rentalsResponse]);

  const filteredRentals = useMemo(
    () => filterByRange(rentals, timeRange),
    [rentals, timeRange]
  );

  const earningsTotals = useMemo(() => {
    return filteredRentals.reduce(
      (acc, rental) => {
        const amount = safeNumber(
          rental.totalCost ?? rental.amount ?? rental.payment?.amount
        );
        const status = (rental.status || '').toLowerCase();

        acc.total += amount;

        if (status === 'completed') {
          acc.completed += amount;
        } else if (status === 'cancelled' || status === 'rejected') {
          acc.cancelled += amount;
        } else {
          acc.pending += amount;
        }

        return acc;
      },
      { total: 0, completed: 0, pending: 0, cancelled: 0 }
    );
  }, [filteredRentals]);

  const chartData = useMemo(
    () => buildChartData(filteredRentals, timeRange, earningsTotals.total),
    [filteredRentals, timeRange, earningsTotals.total]
  );

  const maxChartAmount = useMemo(() => {
    if (chartData.length === 0) return 1;
    return Math.max(...chartData.map((item) => item.amount));
  }, [chartData]);

  const topCars = useMemo(
    () => buildCarBreakdown(filteredRentals).slice(0, 5),
    [filteredRentals]
  );

  const recentTransactions = useMemo(() => {
    return [...filteredRentals]
      .sort((a, b) => {
        const dateA = getRentalDate(a)?.getTime() ?? 0;
        const dateB = getRentalDate(b)?.getTime() ?? 0;
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [filteredRentals]);

  if (isLoading && rentals.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        Loading earnings…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings Overview</h1>
          <p className="text-sm text-gray-500">
            Track payouts, upcoming income, and top-performing vehicles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FiCalendar className="text-gray-500" />
          <select
            value={timeRange}
            onChange={(event) => setTimeRange(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error?.data?.message || 'Unable to load earnings data right now.'}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Earnings</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              ${earningsTotals.total.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Includes completed, confirmed, and pending payouts in this period.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <FiDollarSign className="h-5 w-5" />
          </div>
        </article>

        <article className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Completed Payouts</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              ${earningsTotals.completed.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Sum of rentals marked as completed.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FiTrendingUp className="h-5 w-5" />
          </div>
        </article>

        <article className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Earnings</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              ${earningsTotals.pending.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Rentals awaiting confirmation or currently in progress.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
            <FiArrowUpRight className="h-5 w-5" />
          </div>
        </article>

        <article className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Lost to Cancellations</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              ${earningsTotals.cancelled.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Value of rentals cancelled or rejected during this period.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FiTrendingUp className="h-5 w-5" />
          </div>
        </article>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Earnings Trend</h2>
          <button
            type="button"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <FiFilter className="mr-1" /> Export Data
          </button>
        </div>
        <div className="flex h-56 items-end gap-4 border-b border-l border-gray-100 bg-gray-50 p-4">
          {chartData.length === 0 ? (
            <p className="text-sm text-gray-500">
              No earnings recorded for the selected period.
            </p>
          ) : (
            chartData.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center">
                <div
                  className="flex w-8 items-end justify-center rounded-t bg-orange-500 transition-colors hover:bg-orange-600"
                  style={{
                    height: `${Math.max(4, (item.amount / maxChartAmount) * 160)}px`,
                  }}
                  title={`$${item.amount.toFixed(2)}`}
                />
                <span className="mt-2 text-xs text-gray-500">{item.label}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Top Earning Vehicles</h2>
            <FaCar className="text-gray-400" />
          </div>
          {topCars.length === 0 ? (
            <p className="text-sm text-gray-500">No rentals recorded for this period.</p>
          ) : (
            <ul className="space-y-3">
              {topCars.map((car) => (
                <li
                  key={car.carId}
                  className="flex items-center justify-between rounded-md border border-gray-100 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                      {car.imageUrl ? (
                        <img
                          src={car.imageUrl}
                          alt={car.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-500">
                        <FaCar />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{car.name}</p>
                      <p className="text-xs text-gray-500">
                        {car.trips} trip{car.trips === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ${car.total.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Booking</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Vehicle</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Renter</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Dates</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No transactions in this period.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((rental) => {
                    const amount = safeNumber(
                      rental.totalCost ?? rental.amount ?? rental.payment?.amount
                    );
                    const car = rental.car ?? {};
                    const renter = rental.user ?? rental.customer ?? {};
                    const start = getRentalDate(rental);
                    const end = rental.endDate ? parseISO(rental.endDate) : null;

                    return (
                      <tr key={rental.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          #{String(rental.id).slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {car.make} {car.model}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {renter.name || 'Customer'}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {start ? format(start, 'MMM d, yyyy') : 'N/A'}
                          {end ? ` - ${format(end, 'MMM d, yyyy')}` : ''}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              rental.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : rental.status === 'cancelled'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {rental.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                          ${amount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t px-6 py-4 text-sm text-gray-500">
            <span>
              Showing {recentTransactions.length} of {filteredRentals.length} rentals in this period.
            </span>
            <button className="text-orange-600 hover:text-orange-700">View all</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Earnings;
