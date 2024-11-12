import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Filteredloc = () => {
  const { location } = useParams();  // Get the location from the URL
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      const response = await fetch(`/api/colleges?location=${location}`); // API call to get colleges by location
      const data = await response.json();
      setColleges(data);
    };

    fetchColleges();
  }, [location]);

  return (
    <section className="p-10 bg-gray-100 text-gray-900">
      <h2 className="text-3xl font-bold text-center">Colleges in {location}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {colleges.length > 0 ? (
          colleges.map((college, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <h3 className="text-xl font-semibold mt-2">{college.name}</h3>
              <p className="mt-1">{college.description}</p>
            </div>
          ))
        ) : (
          <p>No colleges found in {location}.</p>
        )}
      </div>
    </section>
  );
};

export default Filteredloc;
