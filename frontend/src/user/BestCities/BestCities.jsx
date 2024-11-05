// src/components/CoursesOffered.js
import React from "react";

const cities = [
  { name: "Mangalore", icon: "🏖" },
  { name: "Bangalore", icon: "🏙" },
  { name: "Chennai", icon: "🏯" },
  { name: "Ernakulam", icon: "🌳" },
];

const BestCities = () => {
  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-semibold mb-8">Best Cities We Have</h2>
      <div className="flex justify-center gap-8">
        {cities.map((city, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-100 rounded-full shadow-md p-6 w-40 h-40 justify-center transition-transform transform hover:scale-105"
          >
            <div className="text-4xl mb-4">{city.icon}</div>
            <div className="text-lg font-semibold">{city.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestCities;