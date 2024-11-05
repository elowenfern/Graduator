import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setAllColleges } from '../../Redux/slices/collegeSlice'; // Adjust the path based on your file structure

const CollegeList = () => {
  const dispatch = useDispatch();
  const colleges = useSelector((state) => state.colleges.colleges);
  const token = useSelector((state) => state.colleges.token);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/colleges/', {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <div key={college.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{college.name}</h2>
            <p className="text-gray-600 mb-4">Location: {college.location}</p>
            <button 
              className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={() => console.log(`Get admission for ${college.name}`)} // Replace with actual navigation
            >
              Get Admission
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeList;
