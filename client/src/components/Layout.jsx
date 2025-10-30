import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl py-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
