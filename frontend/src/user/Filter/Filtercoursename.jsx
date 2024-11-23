import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // To get route parameters and use Link for navigation

const FilteredColleges = () => {
  const { category, course } = useParams();  // Extract category and course from the URL
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = process.env.REACT_APP_API_URL;
  
  // Fetch colleges based on the course
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        // Assuming you have an API that filters by category and course
        const response = await fetch(`${baseURL}/api/college?course_name=${course}`);
        const data = await response.json();
        console.log('Fetched data:', data); 
        setColleges(data);  // Store the fetched colleges
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [course]);  // Run this effect when course changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (colleges.length === 0) {
    return <div>No colleges found offering {course} in {category} category.</div>;
  }

  return (
    <div>
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-6">
    Colleges Offering {course} in {category} Category
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {colleges.map((college) => (
       
      <div
        key={college.id}
        className="border rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105"
      >
       
       {college.images && college.images.length > 0 && (
        
              <img 
                src={`${baseURL}${college.images[0].image}`}  // Accessing the first image's URL
                alt={college.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}
        
        <h3 className="text-xl sm:text-2xl font-semibold mt-4">{college.name}</h3>
        <p className="text-gray-600 text-sm sm:text-base">{college.location}</p>
        <Link
          to={`/colleges/${college.id}`}
          className="block mt-4 text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
        >
          Get Admission
        </Link>
      </div>
    ))}
  </div>
</div>

  );
};

export default FilteredColleges;
