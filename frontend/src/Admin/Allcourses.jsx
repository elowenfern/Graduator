import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);

  const fetchColleges = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/colleges/', {
        headers: {
          'Authorization': `Token YOUR_TOKEN_HERE`,
        },
      });
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/colleges/${id}/`, {
        headers: {
          'Authorization': `Token YOUR_TOKEN_HERE`,
        },
      });
      setColleges(colleges.filter((college) => college.id !== id)); // Remove the deleted college from state
    } catch (error) {
      console.error('Error deleting college:', error);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Location</th>
            <th className="py-2 px-4 border-b">Action</th>
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
                  <Link to={`/courses/${college.id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600">
                      Courses
                    </button>
                  </Link>
                  {/* <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDelete(college.id)}
                  >
                    Delete
                  </button> */}
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
    </div>
  );
};

export default CollegesPage;
