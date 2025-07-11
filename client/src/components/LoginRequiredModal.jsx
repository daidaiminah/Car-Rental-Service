import React from 'react';
import { Link } from 'react-router-dom';

const LoginRequiredModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Login Required</h3>
        <p className="mb-6 text-gray-600">
          You need to be logged in to book a car. Please sign in or create an account to continue.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <Link
            to="/login"
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
