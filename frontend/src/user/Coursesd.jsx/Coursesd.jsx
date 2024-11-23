import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const Coursed = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [colleges, setColleges] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [error, setError] = useState(null);
  
  const baseURL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();  // Initialize navigate

  // Fetch categories and set the initial selected category
  useEffect(() => {
    fetch(`${baseURL}/api/course-categories/`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].key); // Set the initial category
        }
        setLoadingCategories(false);
      })
      .catch((error) => {
        console.error("Error fetching course categories:", error);
        setError("Failed to load course categories.");
        setLoadingCategories(false);
      });
  }, []);

  // Fetch colleges based on the selected category
  useEffect(() => {
    if (selectedCategory) {
      setLoadingColleges(true);
      setError(null);
      fetch(`${baseURL}/api/course_colleges/?category=${selectedCategory}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Response data:", data); // Log the API response
          if (Array.isArray(data)) {
            setColleges(data);
          } else {
            console.error("Expected array of colleges but got:", data);
            setColleges([]);
          }
          setLoadingColleges(false);
        })
        .catch((error) => {
          console.error("Error fetching colleges:", error);
          setError("Failed to load colleges.");
          setLoadingColleges(false);
        });
    }
  }, [selectedCategory]);

  // Handle card click to navigate to CollegeDetails page
  const handleCollegeClick = (collegeId) => {
    navigate(`/colleges/${collegeId}`);  // Navigate to CollegeDetails with college ID
  };

  if (loadingCategories) {
    return <div className="text-center text-gray-600">Loading categories...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-700 p-4">
        <ul className="flex flex-wrap justify-center space-x-4 sm:space-x-8">
          {categories.map((category) => (
            <li key={category.key} className="mb-2 sm:mb-0">
              <button
                onClick={() => setSelectedCategory(category.key)}
                className={`text-white font-semibold px-4 py-2 rounded ${
                  selectedCategory === category.key ? "bg-green-500" : "hover:text-blue-200"
                }`}
              >
                {category.value}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Loading colleges */}
      {loadingColleges && <div className="text-center text-gray-600">Loading colleges...</div>}

      {/* Error message */}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* College List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {colleges.map((college) => (
          <div
            key={college.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => handleCollegeClick(college.id)}  // Add onClick event to navigate
          >
            <img
              src={`${baseURL}${college.image}`}
              alt={college.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{college.name}</h3>
              <p className="text-gray-600">{college.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* No colleges message */}
      {colleges.length === 0 && !loadingColleges && (
        <div className="text-center text-gray-600 mt-8">
          <p>No colleges available for the selected category.</p>
        </div>
      )}
    </div>
  );
};

export default Coursed;
