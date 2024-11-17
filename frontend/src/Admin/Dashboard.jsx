import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DASHBOARD = () => {
  const [colleges, setColleges] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState(null); // Track the college to be deleted

  const fetchColleges = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/colleges/', {
        headers: {
          'Authorization': `Token YOUR_TOKEN_HERE`, // Replace with your actual token
        },
      });
      setColleges(response.data); // Update the state with fetched data
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/colleges/${collegeToDelete.id}/`, {
        headers: {
          'Authorization': `Token YOUR_TOKEN_HERE`, // Replace with your actual token
        },
      });
      setColleges(colleges.filter((college) => college.id !== collegeToDelete.id)); // Remove from local state
      setShowDeleteConfirmation(false); // Close the confirmation modal
      setCollegeToDelete(null); // Reset the college to be deleted
    } catch (error) {
      console.error('Error deleting college:', error);
    }
  };

  useEffect(() => {
    fetchColleges(); // Fetch colleges on component mount
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {colleges.length > 0 ? (
            colleges.map((college) => (
              <tr key={college.id}>
                <td className="py-2 px-4 border-b">{college.id}</td>
                <td className="py-2 px-4 border-b">{college.name}</td>
                <td className="py-2 px-4 border-b">{college.location}</td>
                <td className="py-2 px-4 border-b">
                  <Link to={`/edit/${college.id}`}>
                    <button className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">Edit</button>
                  </Link>
                  <button 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" 
                    onClick={() => {
                      setCollegeToDelete(college); // Set the college to delete
                      setShowDeleteConfirmation(true); // Show the delete confirmation modal
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 text-center">No colleges found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this college?</h3>
            <div className="flex justify-end">
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
