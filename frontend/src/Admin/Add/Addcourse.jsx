import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    fees: '',
    semester: '', // Added semester field
    years: '', // Added years field
  });
  const token = 'YOUR_TOKEN_HERE'; // Replace with your token
  const navigate = useNavigate();

  // Fetch the list of colleges
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/colleges/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        setColleges(response.data); // Store fetched colleges
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };
    fetchColleges();
  }, [token]);

  // Handle course input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  // Handle course form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare course data
    const newCourse = {
      ...courseData,
      college: selectedCollege, // Attach the selected college
    };

    try {
      // Send the course data to the backend
      const response = await axios.post('http://localhost:8000/api/courses/', newCourse, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      console.log('Course added:', response.data);
      navigate('/allcourse'); // Redirect after success
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Select College */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="college">
            Select College
          </label>
          <select
            id="college"
            name="college"
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">-- Select College --</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.id}>
                {college.name}
              </option>
            ))}
          </select>
        </div>

        {/* Course Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Course Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={courseData.name}
            onChange={handleInputChange}
            placeholder="Course Name"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Course Description */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Course Description
          </label>
          <textarea
            id="description"
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            placeholder="Course Description"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Course Fees */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fees">
            Course Fees
          </label>
          <input
            type="number"
            id="fees"
            name="fees"
            value={courseData.fees}
            onChange={handleInputChange}
            placeholder="Course Fees"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Course Semester */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
            Semester
          </label>
          <input
            type="number"
            id="semester"
            name="semester"
            value={courseData.semester}
            onChange={handleInputChange}
            placeholder="Number of Semesters"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Course Years */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="years">
            Years
          </label>
          <input
            type="number"
            id="years"
            name="years"
            value={courseData.years}
            onChange={handleInputChange}
            placeholder="Number of Years"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
