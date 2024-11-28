import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setAllColleges } from '../../Redux/slices/collegeSlice'; // Adjust the path based on your file structure
import { Link } from 'react-router-dom';
import config from '../../config';

const CollegeList = () => {
  const dispatch = useDispatch();
  const baseURL = config.API_URL;
  const colleges = useSelector((state) => state.colleges.colleges);
  const token = useSelector((state) => state.colleges.token);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/colleges/`, {
          headers: {
            Authorization: `Token ${token}`, // Include the token if needed
          },
        });
        dispatch(setAllColleges(response.data)); // Dispatch action to set colleges in Redux
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, [dispatch, token]); // Dependencies to run effect on

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Colleges for Admission</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {colleges.map((college) => (
          <div key={college.id} className="bg-white shadow-md rounded-lg p-4">
            {/* Display the first image if available */}
            {college.images && college.images.length > 0 && (
              <img 
                src={college.images[0].image} // Accessing the first image's URL
                alt={college.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}
            {/* Display full college name */}
            <h3 className="text-xl font-semibold mt-2">{college.name}</h3>
            <p className="mt-1 text-gray-600"></p>
            <p className="mt-1 text-gray-600">Location: {college.location}</p>
            <Link to={`/colleges/${college.id}`}>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg mt-4"
              >
                Get Admission
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeList;
