import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search") || "";
    
    const fetchColleges = async () => {
        try {
          setLoading(true);
  
          const params = {};
          if (searchQuery) params.college_name = searchQuery; // Use a single parameter
  
          console.log("Sending params:", params);
          const response = await axios.get(`${baseURL}/api/colleges/`, { params });
          console.log("Response data:", response.data);
          setColleges(response.data);
        } catch (err) {
          setError("Failed to fetch colleges");
        } finally {
          setLoading(false);
        }
      };
  
      fetchColleges();
    }, [location]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {colleges.length > 0 ? (
        colleges.map((college) => (
          <Link to={`/colleges/${college.id}`} key={college.id}>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={
                  college.images.length > 0
                    ? college.images[0].image
                    : "/default-image.jpg"
                }
                alt={college.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{college.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{college.location}</p>
                {/* <p className="text-sm text-gray-600 mt-1">{college.university.university__name}</p> */}
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500">
          No colleges found matching your search criteria.
        </div>
      )}
    </div>
  );
};

export default SearchResults;
