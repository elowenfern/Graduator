import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const Coursed = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [courses, setCourses] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState(null);

  const baseURL = config.API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${baseURL}/api/course-categories/`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Categories:', data);
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].key);
        }
        setLoadingCategories(false);
      })
      .catch((error) => {
        console.error("Error fetching course categories:", error);
        setError("Failed to load categories.");
        setLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setLoadingCourses(true);
      setError(null);
      fetch(`${baseURL}/api/course_category/?category=${selectedCategory}`)
        .then((response) => response.json())
        .then((data) => {
          setCourses(data);
          setLoadingCourses(false);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
          setError("Failed to load courses.");
          setLoadingCourses(false);
        });
    }
  }, [selectedCategory]);

  const handleCourseClick = (course) => {
    navigate(`/course-details/${encodeURIComponent(course.name)}`);
  };

  if (loadingCategories) {
    return <div className="text-center text-gray-600">Loading categories...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 p-4">
        <ul className="flex flex-wrap justify-center space-x-4 sm:space-x-8">
          {categories.map((category) => (
            <li key={category.key} className="mb-2 sm:mb-0">
              <button
                onClick={() => setSelectedCategory(category.key)}
                className={`text-white font-semibold px-4 py-2 rounded ${
                  selectedCategory === category.key ? "bg-blue-500" : "hover:bg-blue-400"
                }`}
              >
                {category.value}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {loadingCourses && <div className="text-center text-gray-600 mt-4">Loading courses...</div>}

      {error && <div className="text-center text-red-600 mt-4">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {courses.map((course) => {
      
      
      return (
        <div
          key={course.id}
          className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
          onClick={() => handleCourseClick(course)}
        >
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            {course.image ? (
              <img
                src={`${baseURL}${course.image}`}
                alt={course.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600">No Image</span>
            )}
          </div>
          <div className="p-2 text-center">
            <p className="text-sm font-semibold text-gray-700">{course.name}</p>
          </div>
        </div>
      );
    })}
    </div>
    </div>
  );
};

export default Coursed;
