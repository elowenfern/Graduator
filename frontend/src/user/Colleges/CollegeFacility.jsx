// CollegeFacilities.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBed, FaCoffee, FaBus, FaWifi, FaBook, FaFlask, FaRunning } from 'react-icons/fa';

const facilityIcons = {
    "Boys Hostel": <FaBed />,
    "Girls Hostel": <FaBed />,
    "Cafeteria": <FaCoffee />,
    "Sports": <FaRunning />,
    "Lab": <FaFlask />,
    "Library": <FaBook />,
    "WiFi": <FaWifi />,
    "Transportation": <FaBus />
};

const CollegeFacilities = ({ collegeId }) => {
    const [college, setCollege] = useState(null);

    useEffect(() => {
        axios.get(`/api/colleges/${collegeId}/`)
            .then(response => {
                setCollege(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the college data!", error);
            });
    }, [collegeId]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Facilities and Infrastructure</h2>
            <div className="grid grid-cols-3 gap-4">
                {college && college.facilities.map(facility => (
                    <div key={facility.id} className="flex flex-col items-center p-4 border rounded-lg shadow">
                        <div className="text-4xl mb-2">
                            {facilityIcons[facility] || <FaBook />}  {/* Default icon if not found */}
                        </div>
                        <p className="text-sm font-medium">{facility.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollegeFacilities;
