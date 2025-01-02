import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setAllColleges } from '../../Redux/slices/collegeSlice';
import { Link } from 'react-router-dom';
import config from '../../config';
import BookAdmissionForm from "../Contact/Sidebook";
import TopColleges from "../Colleges/Topcolleges";
import PopularCoursesSection from "../Colleges/PopularCourse";

const CollegeList = () => {
  const dispatch = useDispatch();
  const baseURL = config.API_URL;
  const colleges = useSelector((state) => state.colleges.colleges || []);
  const token = useSelector((state) => state.colleges.token);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/colleges/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        dispatch(setAllColleges(response.data)); // Dispatch action to set colleges in Redux
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        setLoading(false); // Set loading to false on error
        setError('Error fetching colleges. Please try again later.');
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, [dispatch, token]);

  return (
    <div className="relative min-h-screen bg-gray-100 text-black">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Colleges for Admission</h1>

        {/* Error Handling */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="flex flex-col md:flex-row">
          {/* Left Section: College Grid */}
          <div className="flex-1 bg-white p-6 shadow-lg rounded-lg">
            {/* Show loading state */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {colleges.map((college) => (
                  <div
                    key={college.id}
                    className="bg-white shadow-xl rounded-lg p-4 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    {/* Display the first image if available */}
                    {college.images && college.images.length > 0 && (
                      <img
                        src={`${config.API_URL}${college.images[0]?.image}`}
                        alt={college.name}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    {/* Display full college name */}
                    <h3 className="text-xl font-semibold mt-2">{college.name}</h3>
                    <p className="mt-1 text-gray-600">Location: {college.location}</p>
                    <Link to={`/colleges/${college.slug}`}>
                      <button
                        className="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition-colors duration-300"
                      >
                        Get Admission
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section: Sidebar (Set to 25% width) */}
          <div className="w-full md:w-1/4 bg-white shadow-lg rounded-lg mt-6 md:mt-0 ml-0 md:ml-6 p-6">
            <div className="mb-6">
              <BookAdmissionForm />
            </div>
            <div className="mb-6">
              <PopularCoursesSection />
            </div>
            <div className="mb-6">
              <TopColleges />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeList;
