import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import config from "../config";

const DASHBOARD = () => {
  const [colleges, setColleges] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState(null);

  const fetchColleges = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/colleges/`, {
        headers: {
          Authorization: `Token YOUR_TOKEN_HERE`, // Replace with your actual token
        },
      });
      setColleges(response.data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${config.API_URL}/api/colleges/${collegeToDelete.id}/`, {
        headers: {
          Authorization: `Token YOUR_TOKEN_HERE`, // Replace with your actual token
        },
      });
      setColleges(colleges.filter((college) => college.id !== collegeToDelete.id));
      setShowDeleteConfirmation(false);
      setCollegeToDelete(null);
    } catch (error) {
      console.error("Error deleting college:", error);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleMapLocation = (college) => {
    const { latitude, longitude } = college.location || {};
    if (latitude && longitude) {
      return `https://www.google.com/maps?q=${latitude},${longitude}`;
    }
    return "";
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Colleges Dashboard</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b border-r">Name</th>
            <th className="py-2 px-4 border-b border-r">Location</th>
            <th className="py-2 px-4 border-b border-r">Map URL</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {colleges.length > 0 ? (
            colleges.map((college) => (
              <tr key={college.id}>
                <td className="py-2 px-4 border-b">{college.id}</td>
                <td className="py-2 px-4 border-b border-r">{college.name}</td>
                <td className="py-2 px-4 border-b border-r">{college.location}</td>
                <td className="py-2 px-4 border-b border-r">
                  {college.location ? (
                    <a
                      href={handleMapLocation(college)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Map
                    </a>
                  ) : (
                    "No location available"
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  <Link to={`/edit/${college.id}`}>
                    <button className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => {
                      setCollegeToDelete(college);
                      setShowDeleteConfirmation(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-2 px-4 text-center">
                No colleges found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this college?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DASHBOARD;
