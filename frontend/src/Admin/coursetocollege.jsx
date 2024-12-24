import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const CollegePage = () => {
  const [colleges, setColleges] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [fees, setFees] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCourseAdded, setIsCourseAdded] = useState(false);

  const baseURL = config.API_URL;
  const token = 'YOUR_TOKEN_HERE'; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/colleges/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setColleges(response.data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, [baseURL, token]);

  useEffect(() => {
    if (selectedCollegeId) {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(`${baseURL}/api/courses/`, {
            headers: { Authorization: `Token ${token}` },
          });
          setCourseOptions(response.data);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };

      fetchCourses();
    }
  }, [selectedCollegeId, baseURL, token]);

  const openModal = (collegeId) => {
    setSelectedCollegeId(collegeId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCollegeId(null);
    setSelectedCourseId('');
    setFees('');
  };

  const handleAddCourseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Submitting data:", {
      college: parseInt(selectedCollegeId, 10),
      course: parseInt(selectedCourseId, 10),
      fees: parseFloat(fees),
    });

    try {
      const response = await axios.post(
        `${baseURL}/api/college_courses/${selectedCollegeId}/`,
        {
          college: parseInt(selectedCollegeId, 10),
          course: parseInt(selectedCourseId, 10),
          fees: parseFloat(fees),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response && response.status >= 200 && response.status < 300) {
        setIsCourseAdded(true);
        setTimeout(() => setIsCourseAdded(false), 3000);
        closeModal();
        setSuccessMessage('Course added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);

        const updatedResponse = await axios.get(`${baseURL}/api/colleges/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setColleges(updatedResponse.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error adding course:', error.response.data);
      } else {
        console.error('Error adding course:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (collegeId) => {
    navigate(`/college/${collegeId}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Colleges</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-md mb-6">
          {successMessage}
        </div>
      )}

      {colleges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <div
            key={college.id}
            className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-50 transition cursor-pointer"
          >
            {/* Navigate to detail page when clicking the card */}
            <div
              onClick={() => handleViewDetails(college.id)}
              className="cursor-pointer"
            >
              <h2 className="text-lg font-medium text-gray-800">{college.name}</h2>
            </div>
      
            {/* Add Course button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering card's click event
                openModal(college.id);
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            >
              Add Course
            </button>
          </div>
        ))}
      </div>
      


      ) : (
        <p className="text-gray-600">No colleges available</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Course to College</h2>
            <form onSubmit={handleAddCourseSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Course:</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">--Select Course--</option>
                  {courseOptions.length > 0 ? (
                    courseOptions.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No courses available</option>
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fees:</label>
                <input
                  type="number"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className={`w-full py-2 rounded-lg text-white shadow-md ${loading ? 'bg-gray-500' : isCourseAdded ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'} transition`}
                  disabled={loading || isCourseAdded}
                >
                  {loading ? 'Loading...' : isCourseAdded ? 'Added' : 'Add Course'}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegePage;