import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout() {
  useEffect(() => {
    // Optionally scroll to top of the page when layout is loaded
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* The Outlet will render the page content here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
