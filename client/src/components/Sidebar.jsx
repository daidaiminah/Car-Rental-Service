import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { getNavigationConfig } from '../config/navigation';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const navRef = useRef(null);
  const firstNavItemRef = useRef(null);
  const lastNavItemRef = useRef(null);
  
  // Handle keyboard navigation
  const handleKeyDown = (e, index, navItems) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % navItems.length;
      navItems[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + navItems.length) % navItems.length;
      navItems[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      navItems[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      navItems[navItems.length - 1]?.focus();
    }
  };
  
  // Focus management for the sidebar
  useEffect(() => {
    const handleFocusIn = (e) => {
      const navItems = Array.from(navRef.current?.querySelectorAll('a[role="menuitem"]') || []);
      
      // If focus is on the first item and user presses Shift+Tab, move focus to the last item
      if (e.target === firstNavItemRef.current && e.shiftKey && document.activeElement === document.body) {
        e.preventDefault();
        lastNavItemRef.current?.focus();
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, []);
  
  // Get navigation links based on user role
  const getNavLinks = () => {
    if (hasRole('admin')) {
      return getNavigationConfig('admin');
    } else if (hasRole('owner')) {
      return getNavigationConfig('owner');
    } else {
      // Default to renter links for customers and any other roles
      return getNavigationConfig('renter');
    }
  };
  // Close sidebar when route changes (handled by parent)

  // Get navigation links
  const navLinks = getNavLinks();
  
  return (
    <aside 
      className="h-screen bg-secondary-dark text-white overflow-y-auto"
      aria-label="Main navigation"
    >
      <div className="p-4 h-full flex flex-col">
        <div className="py-4 px-2 lg:py-8 lg:px-4">
          <h2 className="text-xl lg:text-2xl font-bold text-white truncate">
            Car Rental
          </h2>
        </div>

        <nav 
          className="flex-1 mt-2" 
          ref={navRef}
          role="navigation"
          aria-label="Main menu"
        >
          <ul 
            className="space-y-1" 
            role="menubar" 
            aria-orientation="vertical"
          >
            {navLinks.map((link, index) => {
              const isActive = link.exact === false 
                ? location.pathname.startsWith(link.to)
                : location.pathname === link.to;
              
              // Set refs for first and last items for keyboard navigation
              const refProps = {};
              if (index === 0) refProps.ref = firstNavItemRef;
              if (index === navLinks.length - 1) refProps.ref = lastNavItemRef;
                
              return (
                <li 
                  key={link.to} 
                  role="none"
                >
                  <NavLink
                    to={link.to}
                    role="menuitem"
                    tabIndex={index === 0 ? 0 : -1}
                    onKeyDown={(e) => {
                      const menuItems = Array.from(
                        document.querySelectorAll('a[role="menuitem"]')
                      );
                      handleKeyDown(e, index, menuItems);
                      
                      // Handle Enter and Space key for navigation
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(link.to);
                      }
                    }}
                    className={`group flex items-center px-2 py-3 lg:px-4 lg:py-3 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-dark focus:ring-white ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-secondary hover:text-white focus:bg-secondary focus:text-white'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    {...refProps}
                  >
                    <span className="relative flex items-center">
                      <span 
                        className="w-5 h-5 lg:mr-3 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-5 h-5"
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
                      </span>
                      <span className="hidden lg:inline text-sm font-medium">
                        {link.label}
                      </span>
                      {/* Mobile tooltip */}
                      <span 
                        className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity"
                        role="tooltip"
                      >
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
        <div 
          className="lg:hidden flex items-center justify-around py-2 bg-secondary-dark border-t border-gray-700"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.to || 
              (link.to !== '/' && location.pathname.startsWith(link.to));
            
            // Only show the first 5 items in mobile navigation to avoid overcrowding
            if (index >= 5) return null;
              
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-dark focus:ring-white ${
                  isActive 
                    ? 'text-white bg-primary' 
                    : 'text-gray-300 hover:text-white hover:bg-secondary/50'
                }`}
                aria-label={link.label}
                aria-current={isActive ? 'page' : undefined}
                onKeyDown={(e) => {
                  // Handle keyboard navigation
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(link.to);
                  }
                }}
              >
                <div className="flex flex-col items-center">
                  <svg
                    className="w-6 h-6 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={isActive ? 2 : 1.5}
                      d={link.mobileIcon || link.icon}
                    />
                  </svg>
                  <span className="text-xs mt-1">
                    {link.label.split(' ')[0]}
                  </span>
                </div>
              </NavLink>
            );
          })}
          
          {/* More menu for additional items */}
          {navLinks.length > 5 && (
            <div className="relative group">
              <button 
                className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-dark focus:ring-white"
                aria-haspopup="true"
                aria-expanded="false"
                aria-label="More options"
                onClick={(e) => {
                  e.preventDefault();
                  // Toggle more menu
                  const moreMenu = document.getElementById('more-menu');
                  moreMenu?.classList.toggle('hidden');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const moreMenu = document.getElementById('more-menu');
                    moreMenu?.classList.toggle('hidden');
                  }
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              <div 
                id="more-menu"
                className="hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  {navLinks.slice(5).map((link) => {
                    const isActive = location.pathname === link.to || 
                      (link.to !== '/' && location.pathname.startsWith(link.to));
                      
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={`block px-4 py-2 text-sm ${
                          isActive 
                            ? 'bg-gray-100 text-gray-900' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        role="menuitem"
                        tabIndex="-1"
                        onClick={() => {
                          const moreMenu = document.getElementById('more-menu');
                          moreMenu?.classList.add('hidden');
                        }}
                      >
                        {link.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
