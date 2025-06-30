import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-4xl font-bold text-secondary-dark mt-6">Page Not Found</h2>
      <p className="text-secondary mt-4 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
