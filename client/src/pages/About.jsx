import React from 'react';
import { FaCar, FaShieldAlt, FaClock, FaMapMarkerAlt, FaUsers, FaHandshake } from 'react-icons/fa';
import Hero from '../components/common/Hero';
import Thompson from '../assets/images/thompson1.jpg';

const About = () => {
  const features = [
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
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero 
        title="About Whip In Time"
        subtitle="Your trusted partner for premium car rental services"
        showButtons={true}
      />
      <div className="py-12 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-secondary-dark mb-4">About Whip In Time</h1>
            <p className="text-lg text-secondary-light max-w-3xl mx-auto">
              Your trusted partner for premium car rental services. We provide top-quality vehicles and exceptional service to make your journey comfortable and memorable.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-dark mb-2">{feature.title}</h3>
                <p className="text-secondary-light">{feature.description}</p>
              </div>
            ))}
          </div>
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
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Our dedicated team is committed to your satisfaction.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Thompson N Daiminah Jr',
                role: 'CEO & Founder',
                image: Thompson,
                bio: 'Leading with vision and innovation'
              },
              {
                name: 'Sarah Williams',
                role: 'Operations Manager',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                bio: 'Ensuring smooth operations'
              },
              {
                name: 'Michael Chen',
                role: 'Customer Support',
                image: 'https://randomuser.me/api/portraits/men/75.jpg',
                bio: 'Your satisfaction is our priority'
              }
            ].map((member, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-white text-xl font-bold">{member.name}</h3>
                    <p className="text-gray-200">{member.role}</p>
                    <p className="text-gray-200 text-sm mt-2">{member.bio}</p>
                  </div>
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
