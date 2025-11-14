import React from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaPlane, FaCalendarAlt, FaCarAlt, FaTools, FaBriefcase } from 'react-icons/fa';
import Hero from '../components/common/Hero';

const services = [
  {
    title: 'Car Rentals',
    description: 'Choose from our wide range of vehicles for your next trip. Whether you need a compact car for city driving or an SUV for family vacations, we have you covered.',
    icon: <FaCar className="text-3xl text-primary" />
  },
  {
    title: 'Airport Transfers',
    description: 'Reliable and comfortable airport transfers to and from all major airports. Our professional drivers will ensure you reach your destination on time.',
    icon: <FaPlane className="text-3xl text-primary" />
  },
  {
    title: 'Long Term Leasing',
    description: 'Flexible long-term leasing options for businesses and individuals. Enjoy the benefits of a new car without the long-term commitment.',
    icon: <FaCalendarAlt className="text-3xl text-primary" />
  },
  {
    title: 'Luxury Car Rentals',
    description: 'Experience the ultimate in comfort and style with our luxury car collection. Perfect for special occasions or when you want to travel in style.',
    icon: <FaCarAlt className="text-3xl text-primary" />
  },
  {
    title: '24/7 Roadside Assistance',
    description: 'Round-the-clock support for any issues you might encounter on the road. Our team is always ready to assist you.',
    icon: <FaTools className="text-3xl text-primary" />
  },
  {
    title: 'Corporate Solutions',
    description: 'Tailored car rental solutions for businesses of all sizes. Enjoy special corporate rates and dedicated account management.',
    icon: <FaBriefcase className="text-3xl text-primary" />
  }
];

const ServiceCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg overflow-hidden flex flex-col h-full border border-gray-100 transition-all duration-300 hover:-translate-y-1 ${className}`}>
    {children}
  </div>
);

const Services = () => {
  return (
    <div className="bg-gray-50">
      <Hero 
        title="Our Services"
        subtitle="Discover our comprehensive range of car rental services designed to meet all your transportation needs."
        showButtons={false}
      />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of car rental services designed to meet all your transportation needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1
              }}
            >
              <ServiceCard>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 flex-1">
                    {service.description}
                  </p>
                </div>
              </ServiceCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-medium text-gray-800 mb-3">
            Ready to experience our services?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Contact us today to learn more about how we can meet your car rental needs.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 text-lg"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
