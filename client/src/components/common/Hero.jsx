import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = ({ title, subtitle, showButtons = true, backgroundImage = '/images/hero-bg.jpg' }) => {
  return (
    <div 
      className="relative bg-cover bg-center h-96 flex items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl mb-8">
              {subtitle}
            </p>
          )}
          
          {showButtons && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link 
                to="/cars" 
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200 text-lg"
              >
                Browse Cars
              </Link>
              <Link 
                to="/contact" 
                className="bg-transparent hover:bg-white hover:bg-opacity-10 border-2 border-white text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200 text-lg"
              >
                Contact Us
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
