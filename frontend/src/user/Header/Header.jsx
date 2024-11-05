// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="p-5 bg-green-500 text-white">
    <div className="flex items-center justify-between">
      {/* Logo/Icon */}
      <div className="flex items-center">
        {/* Replace with an actual image for the logo */}
        <img
          src="/path/to/icon.png"
          alt="Graduators Logo"
          className="h-10 w-10 mr-3"
        />
        <h1 className="text-3xl font-bold">Graduators Academy</h1>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="flex space-x-8 text-lg">
          <li><a href="/" className="hover:text-gray-200">Home</a></li>
          <li><Link to="/colleges" className="hover:text-gray-200">Colleges</Link></li>
          <li><a href="/courses" className="hover:text-gray-200">Courses</a></li>
          <li><a href="/contact" className="hover:text-gray-200">Contact Us</a></li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
