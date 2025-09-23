import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Loader = ({ size = 4, text = 'Loading...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <FaSpinner className={`animate-spin text-primary-600 text-${size}xl`} />
      {text && <span className="mt-2 text-gray-600">{text}</span>}
    </div>
  );
};

export default Loader;
