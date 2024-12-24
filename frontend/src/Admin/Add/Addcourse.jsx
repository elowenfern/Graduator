import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const CATEGORY_CHOICES = [
  { value: 'science', label: 'Science' },
  { value: 'arts', label: 'Arts' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'management', label: 'Management' },
  { value: 'medical', label: 'Medical' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'law', label: 'Law' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'paramedical', label: 'Paramedical' },
  { value: 'design', label: 'Design' },
  { value: 'allied health science', label: 'Allied Health Science' },
  { value: 'veterinary', label: 'Veterinary' },
];

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    semester: '',
    years: '',
    category: 'science',  // Default category
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const token = 'YOUR_TOKEN_HERE'; // Replace with actual token
  const navigate = useNavigate();
  const baseURL = config.API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCourse = new FormData();
    newCourse.append('name', courseData.name);
    newCourse.append('description', courseData.description);
    newCourse.append('semester', courseData.semester);
    newCourse.append('years', courseData.years);
    newCourse.append('category', courseData.category);

    if (selectedImage) {
      newCourse.append('image', selectedImage);
    }

    try {
      const response = await axios.post(`${baseURL}/api/courses/`, newCourse, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Course successfully added:', response.data);
      navigate('/allcourse'); // Navigate to the courses list page
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit}>
        {/* Course Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Course Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={courseData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Course Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Semester */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="semester">
            Semester
          </label>
          <input
            type="number"
            id="semester"
            name="semester"
            value={courseData.semester}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Years */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="years">
            Years
          </label>
          <input
            type="number"
            id="years"
            name="years"
            value={courseData.years}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={courseData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            {CATEGORY_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Course Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="image">
            Upload Course Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="mt-1 block w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
