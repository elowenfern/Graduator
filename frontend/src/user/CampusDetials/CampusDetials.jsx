import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const CampusDetails = () => {
  const navigate = useNavigate();  // Initialize useNavigate for programmatic navigation

  const colleges = [
    {
      name: 'SREENIVASA COLLEGE',
      location: 'Bangalore',
      description: 'Known for its excellent engineering programs and research opportunities.',
      image: 'https://example.com/path/to/sreenivasa-college-image.jpg',
    },
    {
      name: 'SRIVINAYAKA COLLEGE',
      location: 'Mangalore',
      description: 'Offers a wide range of undergraduate and postgraduate courses.',
      image: 'https://example.com/path/to/srivnayaka-college-image.jpg',
    },
    {
      name: 'VIVEKANANDA COLLEGE',
      location: 'Ernakulam',
      description: 'Focuses on holistic development and academic excellence.',
      image: 'https://example.com/path/to/vivekananda-college-image.jpg',
    },
    {
      name: 'R.V. COLLEGE OF ENGINEERING',
      location: 'Bangalore',
      description: 'Renowned for its engineering courses and industry connections.',
      image: 'https://example.com/path/to/rv-college-image.jpg',
    },
  ];

  // Function to handle location click and redirect to the filtered colleges page
  const handleLocationClick = (location) => {
    navigate(`/colleges/location/${location}`); // Navigate to the location-specific route
  };

  return (
    <section className="p-10 bg-gray-100 text-gray-900">
      <h2 className="text-3xl font-bold text-center">Top Colleges</h2>
      <p className="mt-4 text-center">
        Explore our top colleges renowned for their academic excellence and vibrant campus life.
      </p>
      
      {/* Location Navigation */}
      <nav className="bg-green-500 p-4 mb-6">
        <ul className="flex justify-center space-x-8">
          <li>
            <a
              href="#"
              className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded"
              onClick={() => handleLocationClick('Bangalore')} // Trigger redirect for Bangalore
            >
              Bangalore
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded"
              onClick={() => handleLocationClick('Mangalore')} // Trigger redirect for Mangalore
            >
              Mangalore
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded"
              onClick={() => handleLocationClick('Ernakulam')} // Trigger redirect for Ernakulam
            >
              Ernakulam
            </a>
          </li>
        </ul>
      </nav>
      
      {/* Colleges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {colleges.map((college, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={college.image}
              alt={college.name}
              className="w-full h-32 object-cover rounded-lg"
            />
            <h3 className="text-xl font-semibold mt-2">{college.name}</h3>
            <p className="mt-1">{college.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CampusDetails;
