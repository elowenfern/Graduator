import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const PopularCoursesSection = () => {
  const [popularCourses, setPopularCourses] = useState([]);
  const [error, setError] = useState(null);

  const baseURL = config.API_URL;
  const navigate = useNavigate();

  const fetchPopularCourses = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/popular-courses/`);
      setPopularCourses(response.data);
    } catch (error) {
      console.error("Error loading courses", error);
      setError("Failed to fetch popular courses.");
    }
  };

  useEffect(() => {
    fetchPopularCourses();
  }, []);

  const handleCourseClick = (course) => {
    navigate(`/course-details/${encodeURIComponent(course.name)}`);
  };

  return (
    <div className="popular-courses-container mt-8 px-6 py-4 bg-gradient-to-r from-blue-800 to-blue-500 rounded-lg shadow-lg">
      <h3 className="text-3xl font-bold mb-4 text-white text-center border-b-2 border-blue-400 pb-2">
        Popular Courses
      </h3>
      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
      <ul className="space-y-3">
        {popularCourses.length > 0 ? (
          popularCourses.map((course) => (
            <li
              key={course.id}
              className="transition-transform transform hover:scale-105 duration-200 ease-in-out bg-white bg-opacity-80 border border-blue-300 rounded-lg px-4 py-3 shadow-md text-center text-gray-700 font-medium hover:bg-blue-400 hover:text-white cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              {course.name}
            </li>
          ))
        ) : (
          <li className="text-lg text-gray-400 text-center">No popular courses available</li>
        )}
      </ul>
    </div>
  );
};

export default PopularCoursesSection;
