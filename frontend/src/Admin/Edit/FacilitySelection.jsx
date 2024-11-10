import React from 'react';
import { FaBed, FaUniversity, FaCar, FaConciergeBell, FaRunning, FaFlask, FaWifi, FaBus } from 'react-icons/fa'; // Example icons

const FacilitySelection = ({ facilities, selectedFacilities, setSelectedFacilities }) => {
  
  // Mapping of facility IDs to corresponding icons
  const facilityIcons = {
    1: <FaBed />,           // Example icon for facility ID 1 (e.g., Hostel)
    2: <FaUniversity />,    // Example icon for facility ID 2 (e.g., University)
    3: <FaCar />,           // Example icon for facility ID 3 (e.g., Parking)
    4: <FaConciergeBell />, // Example icon for facility ID 4 (e.g., Reception)
    5: <FaRunning />,       // Example icon for facility ID 5 (e.g., Gym)
    6: <FaFlask />,         // Example icon for facility ID 6 (e.g., Lab)
    7: <FaWifi />,          // Example icon for facility ID 7 (e.g., Wi-Fi)
    8: <FaBus />,           // Example icon for facility ID 8 (e.g., Bus Service)
  };

  const handleSelectFacility = (facilityId) => {
    setSelectedFacilities((prevSelected) => {
      if (prevSelected.includes(facilityId)) {
        return prevSelected.filter(id => id !== facilityId); // Deselect the facility
      } else {
        return [...prevSelected, facilityId]; // Select the facility
      }
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Facilities</label>
      <div className="grid grid-cols-3 gap-4">
        {facilities.map((facility) => (
          <div key={facility.id} className="flex items-center">
            <input
              type="checkbox"
              id={`facility-${facility.id}`}
              value={facility.id}
              checked={selectedFacilities.includes(facility.id)}
              onChange={() => handleSelectFacility(facility.id)}
              className="mr-2"
            />
            <label htmlFor={`facility-${facility.id}`} className="flex items-center text-sm">
              {/* Display the icon for the facility */}
              <span className="mr-2">{facilityIcons[facility.id]}</span>
              {facility.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilitySelection;
