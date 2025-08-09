import React from 'react';
import { FaCar, FaShieldAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const About = () => {
  return (
    <div className="py-12 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-secondary-dark mb-4">About Whip In Town</h1>
          <p className="text-lg text-secondary-light max-w-3xl mx-auto">
            Your trusted partner for premium car rental services in town. We provide top-quality vehicles and exceptional service to make your journey comfortable and memorable.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: <FaCar className="w-8 h-8 text-primary" />,
              title: 'Wide Selection',
              description: 'Choose from our diverse fleet of well-maintained vehicles.'
            },
            {
              icon: <FaShieldAlt className="w-8 h-8 text-primary" />,
              title: 'Fully Insured',
              description: 'All our vehicles come with comprehensive insurance coverage.'
            },
            {
              icon: <FaClock className="w-8 h-8 text-primary" />,
              title: '24/7 Support',
              description: 'Our support team is always ready to assist you.'
            },
            {
              icon: <FaMapMarkerAlt className="w-8 h-8 text-primary" />,
              title: 'Multiple Locations',
              description: 'Convenient pickup and drop-off locations across the country.'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-secondary-dark mb-2">{feature.title}</h3>
              <p className="text-secondary-light">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-secondary-dark mb-6">Our Story</h2>
          <div className="space-y-4 text-secondary-light">
            <p>
              Founded in 2023, Whip In Town started with a simple mission: to provide reliable and affordable car rental services with exceptional customer experience.
            </p>
            <p>
              Over the years, we've grown from a small local business to a trusted name in car rentals, serving thousands of satisfied customers across the country.
            </p>
            <p>
              Our commitment to quality, transparency, and customer satisfaction sets us apart in the industry.
            </p>
          </div>
        </div>

        {/* Team */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-dark mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Thompson N Daiminah Jr',
                role: 'CEO & Founder',
                image: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              {
                name: 'Sarah Williams',
                role: 'Operations Manager',
                image: 'https://randomuser.me/api/portraits/women/44.jpg'
              },
              {
                name: 'Michael Chen',
                role: 'Customer Support Lead',
                image: 'https://randomuser.me/api/portraits/men/75.jpg'
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-dark">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
