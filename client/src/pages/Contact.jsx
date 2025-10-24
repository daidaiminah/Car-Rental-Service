import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Hero from '../components/common/Hero';

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to send message.');
      }

      toast.success('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact form submission failed:', error);
      toast.error(error.message || 'Unable to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
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

  const socialIcons = [
    { icon: <FaFacebook className="w-5 h-5" />, name: 'Facebook', url: '#' },
    { icon: <FaTwitter className="w-5 h-5" />, name: 'Twitter', url: '#' },
    { icon: <FaInstagram className="w-5 h-5" />, name: 'Instagram', url: '#' },
    { icon: <FaLinkedin className="w-5 h-5" />, name: 'LinkedIn', url: '#' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-light-gray">
      <Hero 
        title="Contact Us"
        subtitle="Have questions or need assistance? Our team is here to help. Reach out to us through any of the following channels."
        showButtons={false}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <motion.div 
          className="grid md:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-secondary-dark mb-6">Get in Touch</h2>
            <p className="leading-relaxed text-gray-600 mb-8">
              We're here to help and answer any questions you might have. We look forward to hearing from you.
            </p>
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0 mt-1 bg-primary/10 p-3 rounded-full">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-12"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-secondary-dark mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                {socialIcons.map((social, index) => (
                  <motion.a 
                    key={index}
                    href={social.url}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-primary hover:bg-primary/10 transition-colors shadow-sm"
                    whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-secondary-dark mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                variants={itemVariants}
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
              >
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
              >
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                ></textarea>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-primary text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium text-lg ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
