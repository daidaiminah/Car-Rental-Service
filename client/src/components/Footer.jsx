import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/safety', label: 'Safety & Support' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/faq', label: 'FAQ' },
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
      url: 'https://facebook.com/whipintown',
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'Twitter',
      icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84',
      url: 'https://twitter.com/whipintown',
      color: 'text-blue-400 hover:text-blue-500'
    },
    {
      name: 'Instagram',
      icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zm0 0a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm6.5-9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
      url: 'https://instagram.com/whipintown',
      color: 'text-pink-600 hover:text-pink-700'
    },
    {
      name: 'LinkedIn',
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      url: 'https://linkedin.com/company/whipintown',
      color: 'text-blue-700 hover:text-blue-800'
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 text-sm">
      <div className="container mx-auto px-4 py-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Whip In Time</h3>
            <p className="leading-relaxed">
              Your trusted partner for reliable and affordable car rental services.
              We offer a wide range of vehicles to suit your needs.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} hover:opacity-80 transition-all`}
                  aria-label={social.name}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
            <div className="mt-4">
              <Link 
                to="/social" 
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                View all our social media profiles
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">Contact Us</h4>
            <address className="not-italic space-y-2">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 text-gray-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>ELWA Rehab, Monrovia, Liberia</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +231 (881) 617698 
                </a>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@carrental.com"
                  className="hover:text-white transition-colors"
                >
                  info@whipintime.com
                </a>
              </div>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">
              Subscribe to our newsletter
            </h4>
            <p className="mb-4">Get the latest updates and offers directly to your inbox.</p>
            <form className="space-y-2">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright and legal */}
        <div className="border-t border-gray-800 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Whip In Time. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center space-x-4">
            <Link
              to='/privacy'
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to='/terms'
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to='/support-team'
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Support Team
            </Link>
            <Link
              to='/safety'
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Safety
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
