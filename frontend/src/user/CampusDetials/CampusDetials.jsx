import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';

const CampusDetails = () => {
  const [colleges, setColleges] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Fetch colleges for the "Top" section
  useEffect(() => {
    const fetchTopColleges = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/sections/Top/colleges/');
        const data = await response.json();
        if (response.ok) {
          setColleges(data.colleges || []);
        } else {
          setError('Failed to fetch colleges for the "Top" section');
        }
      } catch (err) {
        setError('An error occurred while fetching colleges for the "Top" section');
      }
    };

    fetchTopColleges();
  }, []);

  // Fetch unique locations (optional for location filtering)
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/locations/');
        const data = await response.json();
        if (response.ok) {
          setLocations(data.locations || []);
        } else {
          setError('Failed to fetch locations');
        }
      } catch (err) {
        setError('An error occurred while fetching locations');
      }
    };

    fetchLocations();
  }, []);

  const handleLocationClick = (location) => {
    navigate(`/location/${location}`);
  };

  return (
    <section className="p-10 bg-gray-100 text-gray-900">
      {/* Navbar with Locations */}
      <nav className="bg-green-500 p-4 mb-6">
        <ul className="flex justify-center space-x-8">
          {locations.map((location, index) => (
            <li key={index}>
              <a
                href="#"
                className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded"
                onClick={() => handleLocationClick(location)}
              >
                {location}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <h2 className="text-3xl font-bold text-center">Top Colleges</h2>
      <p className="mt-4 text-center">Explore top colleges.</p>

      {/* Display Colleges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {colleges.length === 0 ? (
          <p className="text-center text-red-500 col-span-full">
            No colleges available in the "Top" section.
          </p>
        ) : (
          colleges.map((college, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Image */}
              <div className="h-48 bg-gray-200">
                {college.image ? (
                  <img
                    src={`http://localhost:8000${college.image}`} // Assuming the image URL is relative and served by Django
                    alt={`Image of ${college.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
              <Link to={`/colleges/${college.id}`}>
                <h3 className="text-xl font-extrabold text-teal-600 uppercase tracking-wide hover:text-teal-800 transition-all duration-300">
                  {college.name}
                </h3>
              </Link>
                <p className="text-gray-600 mt-1">{college.location}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </section>
  );
};

export default CampusDetails;
