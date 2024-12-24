import React, { useState } from 'react';
import map1 from '../../Asset/map1.jpg';
import UniversityDetail from './UniversityDetial';

const Photos = ({
  college,
  openModal,
  closeModal,
  selectedImageIndex,
  nextImage,
  prevImage,
}) => {
  const isValidIndex = selectedImageIndex !== null && selectedImageIndex >= 0 && selectedImageIndex < (college?.images?.length || 0);

  return (
    <div id="photos" className="mt-8">
      {/* Photos Grid */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Photos</h2>

        {/* Grid for the first 3 images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {college?.images?.slice(0, 3).map((img, index) => (
            <div
              key={`${img.id}-${index}`}
              className="mb-4"
              onClick={() => openModal(index)} // Trigger modal on thumbnail click
            >
              <img
                src={img?.image || "https://example.com/default-image.jpg"} // Safe fallback
                alt={`College Image ${img?.id}`}
                className="rounded-lg object-cover w-full h-32 sm:h-40 md:h-48 lg:h-56 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* See All Photos link */}
        {college?.images?.length > 3 && (
          <div className="col-span-3 text-center mt-2">
            <a
              href="#see-all-photos"
              className="text-blue-500 hover:underline"
              onClick={() => openModal(3)} // Trigger modal at index 3
            >
              See All
            </a>
          </div>
        )}

        {/* Modal logic with index safeguard */}
        {isValidIndex && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeModal} // Clicking outside closes modal
          >
            <div
              className="relative bg-white rounded-lg p-6 max-w-3xl mx-4"
              onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing modal
            >
              {/* Image Modal */}
              <img
                src={college.images[selectedImageIndex]?.image || "https://example.com/default-image.jpg"}
                alt={`College Image ${college.images[selectedImageIndex]?.id}`}
                className="w-full h-auto object-contain"
              />

              {/* Prev Button */}
              {college?.images?.length > 1 && selectedImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                >
                  &#8592; Prev
                </button>
              )}

              {/* Next Button */}
              {college?.images?.length > 1 && selectedImageIndex < college.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                >
                  Next &#8594;
                </button>
              )}

              {/* Close Modal */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white text-xl"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};







  
  

const Courses = ({ college }) => (
  <div id="courses" className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mb-12">
    <h2 className="text-2xl sm:text-xl md:text-3xl font-semibold text-gray-800">Courses</h2>
    {college.courses && college.courses.length > 0 ? (
      <div className="mt-4 text-base sm:text-sm md:text-lg text-gray-600">
        {college.courses.map((course, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
            <p className="mt-2 text-gray-600 break-words">{course.description}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-base sm:text-sm md:text-lg text-gray-600">
        Information about courses will go here.
      </p>
    )}
  </div>
);




  
  

// Description Component
const Description = ({ college }) => {
  if (!college || !college.name || !college.description) {
    return <p>Loading...</p>;
  }

  return (
    <div id="description" className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mb-12">
      <h1 className="text-3xl sm:text-2xl md:text-4xl font-bold text-gray-800">{college.name}</h1>
      {/* Display the interlinked description */}
      <p
        className="mt-4 text-base sm:text-sm md:text-lg text-gray-600 break-words overflow-hidden"
        dangerouslySetInnerHTML={{ __html: college.description }} // Render the HTML with links
      ></p>

      {/* Map Image */}
      <div className="mt-8">
        <img
          src={map1}
          alt="College Location"
          className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 h-auto rounded-lg shadow-md mx-auto"
        />
      </div>

      {/* Directions Link */}
      {college.location && (
        <div className="mt-4">
          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(college.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Get Directions
          </a>
        </div>
      )}
    </div>
  );
};


  

// Fees Component
const Fees = ({ college }) => {
  if (!college.college_courses || college.college_courses.length === 0) {
    return <div>No courses or fees information available</div>;
  }

  return (
    <div id="fees" className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mb-12">
      <h2 className="text-2xl sm:text-xl md:text-3xl font-semibold text-gray-800 mb-6">
        Fees Structure
      </h2>

      {/* Table displaying fees information */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-4 text-left font-semibold text-gray-800">Course Name</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800">Fee Structure</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800">Semesters</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800">Years</th>
            </tr>
          </thead>
          <tbody>
            {college.college_courses.map((courseItem, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4">{courseItem.course.name}</td>
                <td className="px-6 py-4">Rs {courseItem.fees} </td>
                <td className="px-6 py-4">{courseItem.course.semester}</td>
                <td className="px-6 py-4">{courseItem.course.years}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


    
  
  


export { Courses, Description, Fees,Photos };
