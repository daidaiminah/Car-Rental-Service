import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    toast.success('Your message has been sent successfully!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="w-6 h-6 text-primary" />,
      title: 'Address',
      description: '123 Rental Street, Monrovia, Liberia'
    },
    {
      icon: <FaPhone className="w-6 h-6 text-primary" />,
      title: 'Phone',
      description: '+231 123 456 7890'
    },
    {
      icon: <FaEnvelope className="w-6 h-6 text-primary" />,
      title: 'Email',
      description: 'info@intimewhip.com'
    },
    {
      icon: <FaClock className="w-6 h-6 text-primary" />,
      title: 'Working Hours',
      description: 'Mon - Sun: 8:00 AM - 10:00 PM'
    }
  ];

  return (
    <div className="py-12 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-secondary-dark mb-4">Contact Us</h1>
          <p className="text-lg text-secondary-light max-w-3xl mx-auto">
            Have questions or need assistance? Our team is here to help. Reach out to us through any of the following channels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-secondary-dark mb-6">Get in Touch</h2>
            <p className="leading-relaxed">
              Your trusted partner for reliable and affordable car rental services in town.
              We offer a wide range of vehicles to suit your needs.
            </p>
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-dark">{item.title}</h3>
                    <p className="text-secondary-light">
                      If you have any questions about our services, please contact us at:
                    </p>
                    <p className="text-secondary-light">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-semibold text-secondary-dark mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, index) => (
                  <a 
                    key={index} 
                    href={`#${social.toLowerCase()}`} 
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary hover:text-primary transition-colors shadow-md"
                    aria-label={social}
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-secondary-dark mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-dark mb-1">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-dark mb-1">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-secondary-dark mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-secondary-dark mb-1">
                  Your Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
