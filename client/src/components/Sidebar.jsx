import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navLinks = [
    { 
      to: '/', 
      label: 'Dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      mobileIcon: 'M4 6h16M4 12h16M4 18h16'
    },
    { 
      to: '/customers', 
      label: 'Customers', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      mobileIcon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    { 
      to: '/cars', 
      label: 'Cars', 
      icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
      mobileIcon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
    },
    { 
      to: '/rentals', 
      label: 'Rentals', 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      mobileIcon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2'
    },
  ];

  // Close sidebar when route changes (handled by parent)

  return (
    <aside className="h-screen bg-secondary-dark text-white overflow-y-auto">
      <div className="p-4 h-full flex flex-col">
        <div className="py-4 px-2 lg:py-8 lg:px-4">
          <h2 className="text-xl lg:text-2xl font-bold text-white truncate">
            Car Rental
          </h2>
        </div>

        <nav className="flex-1 mt-2">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to || 
                (link.to !== '/' && location.pathname.startsWith(link.to));
                
              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={`group flex items-center px-2 py-3 lg:px-4 lg:py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-secondary hover:text-white'
                    }`}
                  >
                    <span className="relative flex items-center">
                      <svg
                        className="w-5 h-5 lg:mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={link.icon}
                        />
                      </svg>
                      <span className="hidden lg:inline text-sm font-medium">
                        {link.label}
                      </span>
                      {/* Mobile tooltip */}
                      <span className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                        {link.label}
                      </span>
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile bottom navigation */}
        <div className="lg:hidden flex items-center justify-around py-2 bg-secondary-dark border-t border-gray-700">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || 
              (link.to !== '/' && location.pathname.startsWith(link.to));
              
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`p-2 rounded-full ${
                  isActive 
                    ? 'text-white bg-primary' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <svg
                  className="w-6 h-6 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={isActive ? 2 : 1.5}
                    d={link.mobileIcon || link.icon}
                  />
                </svg>
                <span className="sr-only">{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
