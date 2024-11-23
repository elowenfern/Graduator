import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const Filteredloc = () => {
  const { location } = useParams();
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState(null);
  

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCollegesByLocation = async () => {
      try {
        const response = await fetch(`${baseURL}/api/locations/${location}/colleges`);
        const data = await response.json();
        console.log('API Response:', data);
        if (response.ok) {
          setColleges(data.colleges || []);
        } else {
          setError('Failed to fetch colleges for this location');
        }
      } catch (err) {
        setError('An error occurred while fetching colleges');
      }
    };

    fetchCollegesByLocation();
  }, [location]);

  return (
    <section className="p-10 bg-gray-100 text-gray-900">
      <h2 className="text-3xl font-bold text-center">Colleges in {location}</h2>
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {colleges.length === 0 ? (
          <p className="text-center col-span-full text-gray-600">
            No colleges found in this location.
          </p>
        ) : (
          colleges.map((college, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                {college.image ? (
                  <img
                    src={`${baseURL}${college.image}`}
                    alt={`Image of ${college.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
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
    </section>
  );
};



export default Filteredloc;
