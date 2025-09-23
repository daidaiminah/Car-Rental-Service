import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentSuccess() {
  const { rentalId } = useParams();
  const navigate = useNavigate();

  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/rentals/${rentalId}`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, rentalId]);

  return (
    <div className="bg-white min-h-screen px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <div className="text-center sm:text-left">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <h1 className="mt-3 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Payment successful!
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Thank you for your payment. Your rental has been confirmed.
            </p>
            <div className="mt-6">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Rental #{rentalId} confirmed
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        We've sent a confirmation email with all the details about your rental.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="-mx-2 -my-1.5 flex">
                        <Link
                          to={`/rentals/${rentalId}`}
                          className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                        >
                          View rental details
                        </Link>
                        <Link
                          to="/"
                          className="ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                        >
                          Go back home
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
