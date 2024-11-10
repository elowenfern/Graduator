import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="p-5 bg-green-500 text-white">
      <div className="flex items-center justify-between">
     {/* Logo/Icon */}
        <div className="flex items-center">
          {/* Logo Image */}
          <img
            src="/path/to/icon.png"
            alt="Graduators Logo"
            className="h-10 w-10 mr-3 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" // Responsive sizes
          />
          {/* Logo Text */}
          <h1 className="text-2xl sm:text-xl md:text-3xl lg:text-4xl font-bold">Graduators Academy</h1>
        </div>


        {/* Navigation Links for Desktop */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-8 text-lg">
            <li><a href="/" className="hover:text-gray-200">Home</a></li>
            <li><Link to="/colleges" className="hover:text-gray-200">Colleges</Link></li>
            <li><a href="/courses" className="hover:text-gray-200">Courses</a></li>
            <li><a href="/contact" className="hover:text-gray-200">Contact Us</a></li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-white" onClick={toggleMenu}>
            ☰ {/* You can replace this with an actual hamburger icon */}
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Only visible when the menu is open) */}
      {isOpen && (
        <nav className="md:hidden mt-4">
          <ul className="flex flex-col space-y-4 text-lg">
            <li><a href="/" className="hover:text-gray-200">Home</a></li>
            <li><Link to="/colleges" className="hover:text-gray-200">Colleges</Link></li>
            <li><a href="/courses" className="hover:text-gray-200">Courses</a></li>
            <li><a href="/contact" className="hover:text-gray-200">Contact Us</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
