import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CollegeFacilities from './CollegeFacility';
// Import Font Awesome for location icon (if using Font Awesome)
import { FaMapMarkerAlt } from 'react-icons/fa'; 

const CollegeDetails = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/editcolleges/${id}/`);
        setCollege(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('College not found');
        } else {
          setError('An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">{college.name}</h1>
        <p className="mt-2 text-gray-600">{college.description}</p>
      </div>

      <div className="max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">SITUATED AT</h2>
        <p className="mt-4 text-gray-600">{college.location}</p>
        
        {/* Location Icon with link to Google Maps */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${college.latitude},${college.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 underline mt-4"
        >
          {/* Location Icon (Font Awesome) */}
          <FaMapMarkerAlt className="mr-2 text-xl" />
          LOCATION
        </a>
      </div>
      <CollegeFacilities collegeId={college.id} />
    </div>
  );
};

export default CollegeDetails;
