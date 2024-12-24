import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config'; 

const BestCourses = () => {
  const [courses, setCourses] = useState([]);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/sections/best_courses/`);
        const formattedCourses = response.data.map((section, index) => ({
          id:section.course.id,
          name: section.course_name,
          description: section.course.description,
          shortDescription: section.course.description.substring(0, 100),
          views: section.course.views || 0,
          category: section.course.category || 'N/A',
          image: section.course?.image || '/placeholder.jpg',
        }));
        setCourses(formattedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCourseClick = async (course) => {
    console.log(course.id);
    try {
      await axios.post(`${config.API_URL}/api/courses/${course.id}/increment_view/`);
        navigate(`/course-details/${encodeURIComponent(course.name)}`);
    } catch (error) {
      console.error('Failed to update view count:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-10 text-indigo-600">Popular Courses</h2>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition-transform cursor-pointer"
            >
              <div onClick={() => handleCourseClick(course)}>
                <img
                  className="w-full h-40 object-cover"
                  src={course.image}
                  alt={`${course.name} Image`}
                />
              </div>
              <div className="p-6">
                <h3 
                  className="text-xl font-semibold mb-2 cursor-pointer"
                  onClick={() => handleCourseClick(course)} // Clickable course name
                >
                  {course.name}
                </h3>
                
                <p className="text-sm text-gray-700">
                  {expanded[course.id] ? course.description : course.shortDescription}
                  {course.description.length > 100 && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();  // Prevent parent click
                        toggleExpand(course.id);
                      }}
                      className="text-indigo-500 hover:underline ml-2 cursor-pointer"
                    >
                      {expanded[course.id] ? 'Show Less' : 'See More'}
                    </span>
                  )}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{course.views} views</span>
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500">No popular courses available at the moment.</p>
      )}
    </div>
  );
};

export default BestCourses;
