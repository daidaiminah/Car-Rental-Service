import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  FiArrowLeft,
  FiMapPin,
  FiDroplet,
  FiUsers,
  FiTool,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { useGetCarByIdQuery } from "../store/features/cars/carsApiSlice";
import { useGetRentalsByCarIdQuery } from "../store/features/rentals/rentalsApiSlice";
import { toast } from "react-toastify";

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

const statusBadgeClasses = (status) => {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "confirmed":
    case "in_progress":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: carResponse,
    isLoading: isLoadingCar,
    isError: isCarError,
    error: carError,
  } = useGetCarByIdQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: rentalsResponse,
    isLoading: isLoadingRentals,
  } = useGetRentalsByCarIdQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const car = useMemo(() => {
    if (!carResponse) return null;
    if (carResponse.data) return carResponse.data;
    return carResponse;
  }, [carResponse]);

  const rentals = useMemo(() => {
    const raw = rentalsResponse?.data ?? rentalsResponse ?? [];
    if (!Array.isArray(raw)) return [];
    return [...raw].sort((a, b) => {
      const da = a?.startDate ? new Date(a.startDate).getTime() : 0;
      const db = b?.startDate ? new Date(b.startDate).getTime() : 0;
      return db - da;
    });
  }, [rentalsResponse]);

  if (isCarError) {
    const message =
      carError?.data?.message || carError?.error || "Failed to load car details.";
    toast.error(message);
  }

  if (!id || isLoadingCar) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
      </div>
    );
  }

  if (isCarError || !car) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Car not found</h2>
        <p className="mt-2 text-gray-600">
          We couldn&apos;t find the car you&apos;re looking for. It may have been removed or the
          link is incorrect.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <FiArrowLeft />
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-light-gray min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-xl bg-white">
              <div className="relative h-72 w-full bg-gray-100">
                {car.imageUrl ? (
                  <img
                    src={car.imageUrl}
                    alt={`${car.make} ${car.model}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
                  {car.type || "Vehicle"}
                </span>
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {car.year ? `${car.year} ` : ""}
                      {car.make} {car.model}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      {car.location && (
                        <span className="inline-flex items-center gap-1">
                          <FiMapPin /> {car.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <FiUsers /> {car.seats || "N/A"} seats
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiDroplet /> {car.fuelType || "N/A"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiTool /> {car.transmission || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm uppercase text-gray-500">Daily rate</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(car.rentalPricePerDay)}
                    </p>
                    <span
                      className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        car.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {car.isAvailable ? <FiCheckCircle /> : <FiClock />}
                      {car.isAvailable ? "Available" : "Currently unavailable"}
                    </span>
                  </div>
                </div>

                {car.description && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-800">Description</h2>
                    <p className="mt-2 leading-relaxed text-gray-600">{car.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-800">Vehicle details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Make</p>
                  <p className="font-medium text-gray-900">{car.make || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium text-gray-900">{car.model || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-900">{car.type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium text-gray-900">{car.year || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fuel type</p>
                  <p className="font-medium text-gray-900">{car.fuelType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-medium text-gray-900">{car.transmission || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-medium text-gray-900">{car.seats || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{car.location || "Not specified"}</p>
                </div>
              </div>
            </div>

            {car.ownerId && (
              <div className="rounded-xl bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-800">Owner information</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Owner ID: {car.ownerId}
                </p>
                <p className="text-sm text-gray-600">
                  {car.owner ? `Listed by ${car.owner}` : "Contact support for owner details."}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-800">Rental history</h2>
              {isLoadingRentals ? (
                <div className="mt-6 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
                </div>
              ) : rentals.length === 0 ? (
                <p className="mt-4 text-sm text-gray-600">
                  There are no rentals recorded for this vehicle yet.
                </p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {rentals.map((rental) => {
                    const start = rental.startDate
                      ? format(new Date(rental.startDate), "MMM d, yyyy")
                      : "Unknown";
                    const end = rental.endDate
                      ? format(new Date(rental.endDate), "MMM d, yyyy")
                      : "Unknown";
                    const renter = rental.user?.name || rental.customer?.name || "Customer";

                    return (
                      <li key={rental.id} className="rounded-lg border border-gray-100 p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{renter}</p>
                            <p className="text-sm text-gray-500">
                              {start} - {end}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses(
                                rental.status
                              )}`}
                            >
                              {rental.status || 'Pending'}
                            </span>
                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {formatCurrency(rental.totalCost || rental.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="rounded-xl bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-800">Need assistance?</h2>
              <p className="mt-2 text-sm text-gray-600">
                If you have any questions about this vehicle or need help managing rentals, our support
                team is here to help.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
