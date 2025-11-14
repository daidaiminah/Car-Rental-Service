import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCarByIdQuery, useUpdateCarMutation } from '../store/features/cars/carsApiSlice';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: carResponse, isLoading, isError, error } = useGetCarByIdQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation();

  const car = useMemo(() => {
    if (!carResponse) return null;
    if (carResponse.data) return carResponse.data;
    return carResponse;
  }, [carResponse]);

  const [formState, setFormState] = useState({
    make: '',
    model: '',
    year: '',
    rentalPricePerDay: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (car) {
      setFormState({
        make: car.make || '',
        model: car.model || '',
        year:
          car.year !== undefined && car.year !== null ? String(car.year) : '',
        rentalPricePerDay:
          car.rentalPricePerDay !== undefined &&
          car.rentalPricePerDay !== null
            ? String(car.rentalPricePerDay)
            : '',
        isAvailable:
          typeof car.isAvailable === 'boolean' ? car.isAvailable : true,
      });
    }
  }, [car]);

  useEffect(() => {
    if (isError && error) {
      const message =
        error?.data?.message || error?.error || 'Failed to load car details.';
      toast.error(message);
    }
  }, [isError, error]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!id) return;

    if (!formState.make || !formState.model) {
      toast.error('Make and model are required.');
      return;
    }

    const yearNumber = Number(formState.year);
    const priceNumber = Number(formState.rentalPricePerDay);

    if (!Number.isFinite(yearNumber) || yearNumber < 1900) {
      toast.error('Please provide a valid year.');
      return;
    }

    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      toast.error('Please provide a valid rental price per day.');
      return;
    }

    try {
      await updateCar({
        id,
        make: formState.make,
        model: formState.model,
        year: yearNumber,
        rentalPricePerDay: priceNumber,
        isAvailable:
          formState.isAvailable === true || formState.isAvailable === 'true',
      }).unwrap();

      toast.success('Car updated successfully');
      navigate('/owner/cars');
    } catch (updateError) {
      const message =
        updateError?.data?.message ||
        updateError?.error ||
        'Failed to update car. Please try again.';
      toast.error(message);
    }
  };

  if (isLoading || !car) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="rounded-lg bg-white p-6">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Car</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Make
                </label>
                <input
                  type="text"
                  name="make"
                  value={formState.make}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formState.model}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formState.year}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Rental Price Per Day ($)
                </label>
                <input
                  type="number"
                  name="rentalPricePerDay"
                  value={formState.rentalPricePerDay}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Availability
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="isAvailable"
                    value="true"
                    checked={
                      formState.isAvailable === true ||
                      formState.isAvailable === 'true'
                    }
                    onChange={() =>
                      setFormState((prev) => ({ ...prev, isAvailable: true }))
                    }
                  />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="isAvailable"
                    value="false"
                    checked={
                      formState.isAvailable === false ||
                      formState.isAvailable === 'false'
                    }
                    onChange={() =>
                      setFormState((prev) => ({ ...prev, isAvailable: false }))
                    }
                  />
                  Not Available
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/owner/cars')}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCar;
