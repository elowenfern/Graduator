import React, { useState, useEffect } from 'react';
import { FaBed, FaUniversity, FaCar, FaConciergeBell, FaRunning, FaFlask, FaWifi, FaBus } from 'react-icons/fa'; // Example icons
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AddFacility = ({ token }) => {
  const navigate = useNavigate();  // Initialize useNavigate
  const [facilityName, setFacilityName] = useState('');
  const [facilityIcon, setFacilityIcon] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState('');

  // Map facility name to an icon (you can extend this based on your requirements)
  const iconMap = {
    'Library': <FaUniversity />,
    'Gym': <FaBed />,
    'Parking': <FaCar />,
    'Cafeteria': <FaConciergeBell />,
    "Boys Hostel": <FaBed />,
    "Girls Hostel": <FaBed />,
    "Sports": <FaRunning />,
    "Lab": <FaFlask />,
    "WiFi": <FaWifi />,
    "Transportation": <FaBus />,
  };

  // Fetch colleges from the backend
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/colleges/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        setColleges(response.data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!facilityName || !facilityIcon || !selectedCollege) {
      setError('Please fill out all fields.');
      return;
    }

    // Create facility data
    const facilityData = {
      name: facilityName,
      icon: facilityIcon,
      college: selectedCollege,  // Associate facility with the selected college
    };

    try {
      const response = await axios.post('http://localhost:8000/api/facilities/', facilityData, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      console.log('Facility added:', response.data);

      // Redirect to dashboard after successful addition
      navigate('/dashboard');  // This will redirect to /dashboard

      // Reset state after successful submission
      setFacilityName('');
      setFacilityIcon('');
      setSelectedCollege('');
      setError('');
    } catch (error) {
      console.error('Error adding facility:', error);
      setError('There was an error adding the facility.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Facility</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Facility Name</label>
          <input
            type="text"
            id="name"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            placeholder="Facility Name"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="college">Select College</label>
          <select
            id="college"
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a College</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.id}>
                {college.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="icon">Facility Icon</label>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(iconMap).map((key) => (
              <div key={key} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setFacilityIcon(key)}
                  className={`p-2 border-2 ${facilityIcon === key ? 'border-blue-500' : 'border-gray-300'} rounded-full`}
                >
                  {iconMap[key]}
                </button>
                <span>{key}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Add Facility
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFacility;
