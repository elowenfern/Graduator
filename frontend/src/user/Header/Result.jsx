import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import BookAdmissionForm from "../Contact/Sidebook";
import TopColleges from "../Colleges/Topcolleges";
import PopularCoursesSection from "../Colleges/PopularCourse";

const SearchResults = () => {
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const baseURL = config.API_URL;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search") || "";

    const fetchResults = async () => {
      try {
        setLoading(true);
        const params = { search_query: searchQuery };
        const response = await axios.get(`${baseURL}/api/colleges/`, { params });
        console.log(response.data);

        // Ensure the response is structured correctly before setting state
        const { colleges = [], courses = [], universities = [] } = response.data;

        // Remove duplicates by college id
        const uniqueColleges = [
          ...new Map(colleges.map((college) => [college.id, college])).values(),
        ];

        setColleges(uniqueColleges); // Set colleges (ensure it's always an array)
        setCourses(courses);   // Set courses (ensure it's always an array)
        setUniversities(universities); // Set universities (ensure it's always an array)
      } catch (err) {
        setError("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchResults();
    }
  }, [location.search]);

  const handleRedirect = (courseName) => {
    navigate(`/course-details/${encodeURIComponent(courseName)}`);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="relative min-h-screen bg-gray-100 text-black">
      {/* Left Section - Search Results */}
      <div className="flex flex-col md:flex-row mt-4 w-full">
        {/* Search Results (Colleges, Courses, Universities) */}
        <div className="md:col-span-2 flex-1 bg-white p-6 shadow-md rounded-lg">
          {/* Colleges Section */}
          {colleges.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {colleges.map((college) => (
                <Link key={college.id} to={`/colleges/${college.slug}`}>
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <img
                      src={college.images?.[0] || "/default-image.jpg"}
                      alt={college.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-gray-800">{college.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">{college.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Courses Section */}
          {courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img
                    src={course.image || "/default-image.jpg"}
                    alt={course.name}
                    className="w-full h-48 object-cover cursor-pointer" // Added cursor pointer to indicate clickable
                    onClick={() => handleRedirect(course.name)} // Navigate on image click
                  />
                  <div className="p-4">
                    <h2
                      className="text-xl font-semibold text-gray-800 cursor-pointer" // Added cursor pointer to indicate clickable
                      onClick={() => handleRedirect(course.name)} // Navigate on course name click
                    >
                      {course.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">{course.college_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Universities Section */}
          {universities.length > 0 && (
            <div className="p-6">
              {universities.map((university) => (
                <div key={university.id} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
                  <h2 className="text-2xl font-semibold text-gray-800">{university.name}</h2>
                  <p className="text-sm text-gray-600 mt-2">{university.description}</p>
                  <a href={university.website} className="text-blue-600 mt-2" target="_blank" rel="noopener noreferrer">
                    {university.website}
                  </a>
                  <p className="text-sm text-gray-600 mt-2">Established: {university.established_year}</p>
                </div>
              ))}
            </div>
          )}

          {/* No Results Section */}
          {colleges.length === 0 && courses.length === 0 && universities.length === 0 && (
            <div className="text-center text-gray-500">No results found matching your search criteria.</div>
          )}
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[300px] bg-white shadow-md rounded-lg mt-6 md:mt-0">
          <div className="p-6">
            <BookAdmissionForm />
          </div>
          <div className="p-6">
            <PopularCoursesSection />
          </div>
          <div className="p-6">
            <TopColleges />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
