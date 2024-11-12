import React, { useState, useEffect } from 'react';
import { FaBed, FaUniversity, FaCar, FaConciergeBell, FaRunning, FaFlask, FaWifi, FaBus } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFacility = ({ token }) => {
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState('');
  const [facilityNames, setFacilityNames] = useState([]); // Array to hold selected facilities
  const [colleges, setColleges] = useState([]); // List of existing colleges
  const [facilities, setFacilities] = useState([]); // List of available facilities
  const [error, setError] = useState('');

  // Define icons for each facility type
  const iconMap = {
    'Library': <FaUniversity />,
    'Gym': <FaBed />,
    'Parking': <FaCar />,
    'Cafeteria': <FaConciergeBell />,
    'Boys Hostel': <FaBed />,
    'Girls Hostel': <FaBed />,
    'Sports': <FaRunning />,
    'Lab': <FaFlask />,
    'WiFi': <FaWifi />,
    'Transportation': <FaBus />,
  };

  useEffect(() => {
    // Fetch existing colleges
    const fetchColleges = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/colleges/', {
          headers: { 'Authorization': `Token ${token}` },
        });
        setColleges(response.data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    // Fetch list of available facilities
    const fetchFacilities = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/facilities/', {
          headers: { 'Authorization': `Token ${token}` },
        });
        setFacilities(response.data);
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };

    fetchColleges();
    fetchFacilities();
  }, [token]);

  // Toggle selection for each facility
  const handleCheckboxChange = (facility) => {
    setFacilityNames((prev) =>
      prev.includes(facility) ? prev.filter((name) => name !== facility) : [...prev, facility]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!selectedCollege || facilityNames.length === 0) {
      setError('Please select a college and at least one facility.');
      return;
    }
  
    try {
      const selectedFacilities = facilityNames.map((facilityName) => {
        const facility = facilities.find(f => f.name === facilityName); // Ensure facility is found
        return { id: facility?.id }; // Ensure correct ID is returned
      }).filter(facility => facility.id); // Remove undefined facilities
  
      const response = await axios.put(`http://localhost:8000/api/colleges/${selectedCollege}/`, {
        facilities: selectedFacilities, // Send facility IDs
      }, {
        headers: { 'Authorization': `Token ${token}` },
      });
  
      console.log('Facilities added:', response.data);
      navigate('/dashboard');
      setFacilityNames([]);  // Reset selected facilities
      setSelectedCollege('');  // Reset selected college
      setError('');  // Reset error
    } catch (error) {
      console.error('Error adding facilities:', error.response?.data || error.message);
      setError('There was an error adding the facilities.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Facilities to College</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto">
        {error && <p className="text-red-500 text-sm">{error}</p>}

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
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Facilities</label>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(iconMap).map((facility) => (
              <div key={facility} className="flex flex-col items-center">
                <label>
                  <input
                    type="checkbox"
                    checked={facilityNames.includes(facility)}
                    onChange={() => handleCheckboxChange(facility)}
                    className="mr-2"
                  />
                  {iconMap[facility]} {/* Display facility icon */}
                </label>
                <span>{facility}</span> {/* Display facility name */}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Add Facilities
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFacility;
