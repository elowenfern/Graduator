import React, { useState } from 'react';

const Photos = ({
    college,
    openModal,
    closeModal,
    selectedImageIndex,
    nextImage,
    prevImage,
  }) => (
    <div id="photos" className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Photos</h2>
  
      {/* Grid for the first 3 images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {college.images.slice(0, 3).map((img, index) => (
          <div
            key={`${img.id}-${index}`}
            className="mb-4"
            onClick={() => openModal(index)}  // Open modal when clicking on image
          >
            <img
              src={img.image} // Ensure the full URL is used for image access
              alt={`College Image ${img.id}`}
              className="rounded-lg object-cover w-full h-32 sm:h-40 md:h-48 lg:h-56 cursor-pointer"  // Adjust height based on screen size
            />
          </div>
        ))}
      </div>
  
      {/* See All Photos link */}
      {college.images.length > 3 && (
        <div className="col-span-3 text-center mt-2">
          <a
            href="#see-all-photos"
            className="text-blue-500 hover:underline"
            onClick={() => openModal(3)} // Open modal with the 4th image if there are more than 3
          >
            See All
          </a>
        </div>
      )}
  
      {/* Modal for displaying images */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal} // Close the modal when clicking outside the image
        >
          <div
            className="relative bg-white rounded-lg p-6 max-w-3xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside
          >
            <img
              src={college.images[selectedImageIndex]?.image}
              alt={`College Image ${college.images[selectedImageIndex]?.id}`}
              className="w-full h-auto object-contain" // Keeps the image size responsive inside the modal
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
            >
              &#8592; Prev
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
            >
              Next &#8594;
            </button>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-xl"
            >
              &times; Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  

// Courses Component
const Courses = ({ college }) => (
    <div id="courses" className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mb-12">
      <h2 className="text-2xl sm:text-xl md:text-3xl font-semibold text-gray-800">Courses</h2>
      {college.courses && college.courses.length > 0 ? (
        <div className="mt-4 text-base sm:text-sm md:text-lg text-gray-600">
          {college.courses.map((course, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
              <p className="mt-2 text-gray-600">{course.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-base sm:text-sm md:text-lg text-gray-600">Information about courses will go here.</p>
      )}
    </div>
  );
  
  
  

// Description Component
const Description = ({ college }) => (
    <div id="description" className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mb-12">
      <h1 className="text-3xl sm:text-2xl md:text-4xl font-bold text-gray-800">{college.name}</h1>
      <p className="mt-4 text-base sm:text-sm md:text-lg text-gray-600 break-words overflow-hidden">{college.description}</p>
    </div>
  );
  
  
  

// Fees Component
const Fees = ({ college }) => {
    return (
      <div id="fees" className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mb-12">
        <h2 className="text-2xl sm:text-xl md:text-3xl font-semibold text-gray-800 mb-6">Fees Structure</h2>
  
        {/* Table displaying fees information */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-4 text-left text-sm sm:text-xs md:text-sm font-semibold text-gray-800">Course Name</th>
              <th className="px-6 py-4 text-left text-sm sm:text-xs md:text-sm font-semibold text-gray-800">Fee Structure</th>
              <th className="px-6 py-4 text-left text-sm sm:text-xs md:text-sm font-semibold text-gray-800">Semesters</th>
              <th className="px-6 py-4 text-left text-sm sm:text-xs md:text-sm font-semibold text-gray-800">Years</th>
            </tr>
          </thead>
          <tbody>
            {college.courses && college.courses.length > 0 ? (
              college.courses.map((course, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4 text-gray-700">{course.name}</td>
                  <td className="px-6 py-4 text-gray-700">{course.fees} Rs</td>
                  <td className="px-6 py-4 text-gray-700">{course.semester}</td>
                  <td className="px-6 py-4 text-gray-700">{course.years}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-600">
                  No fee information available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
    
  

// Named Exports
export { Courses, Description, Fees ,Photos};
