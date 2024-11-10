import React from 'react';
import BscAnasth from '../../Asset/Bestcourses/BscAnasth.jpeg'
import Bscmed from '../../Asset/Bestcourses/Bscmed.jpeg'
import BscMicrobiology from '../../Asset/Bestcourses/BscMicrobiology.jpeg'
import MscAnaesth from '../../Asset/Bestcourses/MscAnaesth.jpeg'
import MscEcho from '../../Asset/Bestcourses/MscEcho.jpeg'

const BestCourses = () => {
  const courses = [
    {
      name: 'B.Sc Medical Laboratory Tech',
      description: 'B.Sc in Medical Laboratory Technology',
      views: 843,
      category: 'Paramedical',
      image: Bscmed,
    },
    {
      name: 'M.Sc Anaesthesia and Operation',
      description: 'M.Sc Anaesthesia and Operation Theatre',
      views: 725,
      category: 'Paramedical',
      image: MscAnaesth,
    },
    {
      name: 'B.Sc Anaesthesia and Operation',
      description: 'B.Sc Anaesthesia and Operation Theatre',
      views: 554,
      category: 'Paramedical',
      image: BscAnasth,
    },
    {
      name: 'M.Sc Echocardiography',
      description: 'M.Sc Echocardiography is a two-year course',
      views: 478,
      category: 'Paramedical',
      image: MscEcho,
    },
    {
      name: 'B.Sc Microbiology',
      description: 'B.Sc Microbiology is a 3-year course',
      views: 416,
      category: 'Paramedical',
      image: BscMicrobiology,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Popular Courses</h2>
      
      {/* Navigation Bar */}
      <nav className="bg-green-500 p-4 mb-6">
        <ul className="flex flex-wrap justify-center space-x-4 sm:space-x-8">
          <li>
            <a href="#"  className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded">
              Paramedical
            </a>
          </li>
          <li>
            <a href="#"  className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded">
              Medical
            </a>
          </li>
          <li>
            <a href="#"  className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded">
              Physiotherapy
            </a>
          </li>
          <li>
            <a href="#"  className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded">
              Pharmacy
            </a>
          </li>
          <li>
            <a href="#"  className="text-white font-bold hover:text-green-500 hover:bg-white p-2 rounded">
              Nursing
            </a>
          </li>
        </ul>
      </nav>

      {/* Courses Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              className="w-full h-32 sm:h-48 object-cover"
              src={course.image}
              alt={`${course.name} Image`}
            />
            <div className="p-4">
              <h3 className="text-lg sm:text-xl font-bold">{course.name}</h3>
              <p className="text-sm sm:text-base text-gray-600">{course.description}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-500">{course.views} views</span>
                <span className="bg-green-200 text-green-800 text-xs sm:text-sm px-2 py-1 rounded-full">
                  {course.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestCourses;
