import React from 'react';
import { useNavigate } from 'react-router-dom';
import BscAnasth from '../../Asset/Bestcourses/BscAnasth.jpeg';
import Bscmed from '../../Asset/Bestcourses/Bscmed.jpeg';
import BscMicrobiology from '../../Asset/Bestcourses/BscMicrobiology.jpeg';
import MscAnaesth from '../../Asset/Bestcourses/MscAnaesth.jpeg';
import MscEcho from '../../Asset/Bestcourses/MscEcho.jpeg';

const BestCourses = () => {
  const navigate = useNavigate();

  const courses = [
    {
      name: 'B.Sc Medical Laboratory Tech',
      description: 'B.Sc in Medical Laboratory Technology',
      views: 843,
      category: 'paramedical',
      image: Bscmed,
    },
    {
      name: 'M.Sc Anaesthesia and Operation',
      description: 'M.Sc Anaesthesia and Operation Theatre',
      views: 725,
      category: 'paramedical',
      image: MscAnaesth,
    },
    {
      name: 'B.Sc Anaesthesia',
      description: 'B.Sc Anaesthesia and Operation Theatre',
      views: 675,
      category: 'paramedical',
      image: BscAnasth,
    },
    {
      name: 'M.Sc Echocardiography',
      description: 'M.Sc Echocardiography Technology',
      views: 420,
      category: 'paramedical',
      image: MscEcho,
    },
    // Add more courses as needed
  ];

  // Handle course selection
  const handleCourseClick = (course) => {
    // Navigate to the colleges page with the selected category
    navigate(`/collegee/${course.name}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Popular Courses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            onClick={() => handleCourseClick(course)}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
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
