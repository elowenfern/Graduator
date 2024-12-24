import React from 'react';
import head from '../../Asset/head.jpeg';
const Hero = () => (
  <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage:`url(${head})` }}>
    {/* Overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    
    {/* Hero Content */}
    <div className="relative z-10 flex items-center justify-center h-full">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Graduators Academy</h1>
        <p className="text-xl mb-6">Unlock your potential and achieve greatness with us!</p>
        <a href="#about" className="inline-block bg-blue-800 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg">Get Started</a>
      </div>
    </div>
  </div>
);

export default Hero;
