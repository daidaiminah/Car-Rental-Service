import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  // Function to handle going back to the previous page
  const handleGoBack = () => {
    navigate(-1); // This navigates back one step in the browser history
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-4xl font-bold text-secondary-dark mt-6">Page Not Found</h2>
      <p className="text-secondary mt-4 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button 
          onClick={handleGoBack}
          className="btn-secondary px-6 py-2 rounded-md transition-colors"
        >
          Go Back
        </button>
        <Link to="/" className="btn-primary px-6 py-2 rounded-md transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
