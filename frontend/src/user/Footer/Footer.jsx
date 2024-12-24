import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { FaInstagram, FaWhatsapp, FaFacebook, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto">
        {/* Social Links Section */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Follow Us</h2>
          <p className="mt-2">Connect with us on our social platforms</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="https://www.instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400"
            >
              <FaInstagram size={30} />
            </a>
            <a
              href="https://wa.me/yourwhatsapplink"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400"
            >
              <FaWhatsapp size={30} />
            </a>
            <a
              href="https://www.facebook.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400"
            >
              <FaFacebook size={30} />
            </a>
            <a
              href="https://www.youtube.com/yourchannel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400"
            >
              <FaYoutube size={30} />
            </a>
          </div>
        </div>

        {/* Footer Links and Contact Info */}
        <div className="flex flex-wrap justify-between items-start mb-6">
          {/* Contact Us Section */}
          <div className="w-full sm:w-1/2 lg:w-1/3 text-left px-4">
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p className="text-gray-400">
              Email: <a href="mailto:info@graduatorsacademy.com" className="hover:text-white">info@graduatorsacademy.com</a>
            </p>
            <p className="text-gray-400">
              Phone: <a href="tel:+1234567890" className="hover:text-white">+1 234 567 890</a>
            </p>
            <p className="text-gray-400">Address: 123 Learning Lane, Education City</p>
          </div>

          {/* Quick Links Section */}
          <div className="w-full sm:w-1/2 lg:w-1/3 text-left px-4">
            <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
            <ul>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="text-gray-400 hover:text-white block">
                  Colleges
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white block">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <p className="text-gray-400 text-sm text-center">
          &copy; 2024 Graduators Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
