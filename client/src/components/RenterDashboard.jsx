import React, { useMemo } from "react";
import { useGetRentalsByRenterIdQuery } from "../store/features/rentals/rentalsApiSlice";

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value));
};

const formatDate = (value) => {
  if (!value) return "Unknown";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "Unknown";
  }
};

const statusClasses = (status) => {
  switch ((status || "").toLowerCase()) {
    case "confirmed":
    case "in_progress":
      return "bg-blue-100 text-blue-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const RenterDashboard = ({ userId }) => {
  const {
    data: rentalsResponse = {},
    isLoading,
    isError,
    error,
  } = useGetRentalsByRenterIdQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const rentals = useMemo(() => {
    if (!userId) return [];
    if (Array.isArray(rentalsResponse)) return rentalsResponse;
    if (Array.isArray(rentalsResponse?.data)) return rentalsResponse.data;
    return [];
  }, [userId, rentalsResponse]);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-500">
        Loading your rentals...
      </div>
    );
  }

  if (isError) {
    const message =
      error?.data?.message || error?.error || "Unable to load your rentals.";
    return <div className="text-sm text-red-500">{message}</div>;
  }

  if (!rentals.length) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-2xl font-bold text-secondary-dark">My Rentals</h3>
        <p className="text-sm text-gray-600">
          You haven&apos;t booked any cars yet. Head over to browse cars and start your first rental!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-2xl font-bold text-secondary-dark">My Rentals</h3>
      <div className="space-y-4">
        {rentals.map((rental) => {
          const car = rental.car || rental.Car || {};
          const amount = formatCurrency(
            rental.totalCost ?? rental.totalAmount ?? rental.amount
          );
          return (
            <div
              key={rental.id}
              className="flex flex-col gap-3 rounded-lg border border-gray-100 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {car.make} {car.model}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                    rental.status
                  )}`}
                >
                  {rental.status || "pending"}
                </span>
                <p className="mt-2 text-base font-semibold text-gray-900">{amount}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RenterDashboard;
