import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const DASHBOARD = () => {
  const [colleges, setColleges] = useState([]);

  const fetchColleges = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/colleges/', {
        headers: {
          'Authorization': ``, // Replace with your actual token
        },
      });
      console.log("Fetched data:", response.data); // Log the fetched data
      setColleges(response.data); // Update the state with fetched data
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
      setColleges(colleges.filter((college) => college.id !== id)); // Remove from local state
    } catch (error) {
      console.error('Error deleting college:', error);
    }
  };

  

  useEffect(() => {
    fetchColleges(); // Fetch colleges on component mount
  }, []);

  return (
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
                    
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => handleDelete(college.id)}>Delete</button>
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
  );
};

export default DASHBOARD;
