import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [colleges, setColleges] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [error, setError] = useState(null);
  const baseURL = process.env.REACT_APP_API_URL;
  

  const navigate = useNavigate();

  // Fetch locations
  useEffect(() => {
    fetch(`${baseURL}/api/locations/`)
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
        if (data.length > 0) {
          setSelectedLocation(data[0].key); // Default to the first location
        }
        setLoadingLocations(false);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
        setError("Failed to load locations.");
        setLoadingLocations(false);
      });
  }, []);

  // Fetch colleges based on the selected location
  useEffect(() => {
    if (selectedLocation) {
      setLoadingColleges(true);
      setError(null);
      fetch(`${baseURL}/api/colleges/?location=${selectedLocation}`)
        .then((response) => response.json())
        .then((data) => {
          setColleges(data);
          setLoadingColleges(false);
        })
        .catch((error) => {
          console.error("Error fetching colleges:", error);
          setError("Failed to load colleges.");
          setLoadingColleges(false);
        });
    }
  }, [selectedLocation]);

  // Handle navigation to college details
  const handleCollegeClick = (collegeId) => {
    navigate(`/colleges/${collegeId}`);
  };

  if (loadingLocations) {
    return <div className="text-center text-gray-600">Loading locations...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-700 p-4">
        <ul className="flex flex-wrap justify-center space-x-4 sm:space-x-8">
          {locations.map((location) => (
            <li key={location.key} className="mb-2 sm:mb-0">
              <button
                onClick={() => setSelectedLocation(location.key)}
                className={`text-white font-semibold px-4 py-2 rounded ${
                  selectedLocation === location.key ? "bg-blue-500" : "hover:text-blue-200"
                }`}
              >
                {location.value}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Loading colleges */}
      {loadingColleges && <div className="text-center text-gray-600">Loading colleges...</div>}

      {/* Error message */}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* College List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {colleges.map((college) => (
          <div
            key={college.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => handleCollegeClick(college.id)}
          >
            <img
              src={`${baseURL}${college.image}`}
              alt={college.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{college.name}</h3>
              <p className="text-gray-600">{college.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* No colleges message */}
      {colleges.length === 0 && !loadingColleges && (
        <div className="text-center text-gray-600 mt-8">
          <p>No colleges available for the selected location.</p>
        </div>
      )}
    </div>
  );
};

export default Location;
