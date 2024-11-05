import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Follow Us</h2>
          <p className="mt-2">Connect with us on our social platforms</p>
        </div>
        <div className="flex justify-center space-x-6 mb-4">
          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400"
          >
            <FaInstagram size={30} />
          </a>

          {/* WhatsApp Link */}
          <a
            href="https://wa.me/yourwhatsapplink"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400"
          >
            <FaWhatsapp size={30} />
          </a>
        </div>
        <p className="text-gray-400 text-sm">
          &copy; 2024 Graduators Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
