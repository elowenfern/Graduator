import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // useNavigate for navigation

const Header = () => {
  const [query, setQuery] = useState(""); // Search query
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  // Handle search and filter
  const handleSearchAndFilter = () => {
    if (query.trim()) {
      navigate(`/collegesearch?search=${query}`); 
      setQuery("");
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchAndFilter(); // Trigger search on Enter key press
    }
  };

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="p-5 bg-blue-800 text-white">
      <div className="flex items-center justify-between flex-wrap">
        {/* Logo/Icon */}
        <div className="flex items-center mb-4 sm:mb-0">
          <img
            src="/path/to/icon.png"
            alt="Graduators Logo"
            className="h-10 w-10 mr-3"
          />
          <h1 className="text-2xl font-bold">Graduators Academy</h1>
        </div>

        {/* Navigation and Search Bar */}
        <div className="flex items-center ml-auto space-x-4 w-full sm:w-auto sm:flex-grow justify-end">
          {/* Search Bar (Always visible on desktop, toggleable on mobile) */}
          <div className="relative w-full sm:w-48 md:w-56 lg:w-64">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)} // Update query as user types
              onKeyPress={handleKeyPress} // Trigger search on Enter key
              placeholder="Search for colleges..."
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition duration-300 ease-in-out shadow-md"

            />
            <FaSearch
              className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors duration-200"
              onClick={handleSearchAndFilter} // Trigger search on icon click
            />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-lg">
            <Link to="/" className="hover:text-gray-200">
              Home
            </Link>
            <Link to="/colleges" className="hover:text-gray-200">
              Colleges
            </Link>
            <Link to="/courses" className="hover:text-gray-200">
              Courses
            </Link>
            <Link to="/blog" className="hover:text-gray-200">
              Blogs
            </Link>
            <Link to="/contact" className="hover:text-gray-200">
              Contact Us
            </Link>
          </nav>

          {/* Mobile Navigation Menu (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (visible when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 mt-4">
          <Link to="/" className="text-white hover:text-gray-200">
            Home
          </Link>
          <Link to="/colleges" className="text-white hover:text-gray-200">
            Colleges
          </Link>
          <Link to="/courses" className="text-white hover:text-gray-200">
            Courses
          </Link>
          <Link to="/blog" className="hover:text-gray-200">
              Blogs
            </Link>
          <Link to="/contact" className="text-white hover:text-gray-200">
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
