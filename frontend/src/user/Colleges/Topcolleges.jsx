import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const TopColleges = () => {
  const [colleges, setColleges] = useState([]); // State to store fetched data
  const [error, setError] = useState(null);

  const baseURL = config.API_URL;
  const navigate = useNavigate(); // Initialize navigate hook

  const fetchTopColleges = async () => {
    try {
      const response = await fetch(`${baseURL}/api/sections/Top/colleges/`);
      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        setColleges(data.colleges || []);
        setError(null);
      } else {
        setError('Failed to fetch colleges for the "Top" section');
      }
    } catch (err) {
      setError('An error occurred while fetching colleges for the "Top" section');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchTopColleges();
  }, []); // Fetch data only on initial render

  const handleCollegeClick = (college) => {
    if (college.slug) {
      console.log('Navigating to:', college.slug);
      navigate(`/colleges/${college.slug}`);
    } else {
      console.warn('College slug is missing for:', college);
    }
  };

  return (
    <div className="top-colleges-container mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-900 rounded-lg shadow-lg">
      <h3 className="text-3xl font-bold mb-4 text-white text-center border-b-2 border-blue-400 pb-2">
        Best Colleges
      </h3>
      {error && (
        <p className="text-red-400 text-sm text-center mb-4 font-medium">{error}</p>
      )}
      <ul className="space-y-3">
        {colleges.length > 0 ? (
          colleges.map((college) => (
            <li
              key={college.id}
              className="transition-transform transform hover:scale-105 duration-200 ease-in-out bg-white bg-opacity-80 border border-blue-300 rounded-lg px-4 py-3 shadow-md text-center text-gray-700 font-medium hover:bg-blue-400 hover:text-white cursor-pointer"
              onClick={() => handleCollegeClick(college)} // Add click handler
            >
              {college.name}
            </li>
          ))
        ) : (
          <li className="text-lg text-gray-400 text-center">
            No top colleges available
          </li>
        )}
      </ul>
    </div>
  );
};

export default TopColleges;
