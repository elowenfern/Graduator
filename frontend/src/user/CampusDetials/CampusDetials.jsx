// src/components/TopColleges.js
import React from 'react';

const CampusDetails = () => {
  const colleges = [
    {
      name: 'SREENIVASA COLLEGE',
      description: 'Known for its excellent engineering programs and research opportunities.',
      image: 'https://example.com/path/to/sreenivasa-college-image.jpg', // Replace with actual image URL
    },
    {
      name: 'SRIVINAYAKA COLLEGE',
      description: 'Offers a wide range of undergraduate and postgraduate courses.',
      image: 'https://example.com/path/to/srivnayaka-college-image.jpg', // Replace with actual image URL
    },
    {
      name: 'VIVEKANANDA COLLEGE',
      description: 'Focuses on holistic development and academic excellence.',
      image: 'https://example.com/path/to/vivekananda-college-image.jpg', // Replace with actual image URL
    },
    {
      name: 'R.V. COLLEGE OF ENGINEERING',
      description: 'Renowned for its engineering courses and industry connections.',
      image: 'https://example.com/path/to/rv-college-image.jpg', // Replace with actual image URL
    },
  ];

  return (
    <section className="p-10 bg-gray-100 text-gray-900">
      <h2 className="text-3xl font-bold text-center">Top Colleges</h2>
      <p className="mt-4 text-center">
        Explore our top colleges renowned for their academic excellence and vibrant campus life.
      </p>
       {/* Navigation Bar */}
       <nav className="bg-green-500 p-4 mb-6">
          <ul className="flex justify-center space-x-8">
            <li>
              <a
                href="#"
                className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded"
              >
                Banglore
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded"
              >
                Manglore
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded"
              >
                Ernalulam
              </a>
            </li>
          </ul>
       </nav>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {colleges.map((college, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <img src={college.image} alt={college.name} className="w-full h-32 object-cover rounded-lg" />
            <h3 className="text-xl font-semibold mt-2">{college.name}</h3>
            <p className="mt-1">{college.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CampusDetails;



