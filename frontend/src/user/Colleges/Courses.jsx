import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaUniversity, FaCrown, FaCalendar } from 'react-icons/fa';
import { FaWifi, FaBed, FaParking, FaFootballBall, FaBook, FaFlask, FaChalkboardTeacher, FaShieldAlt, FaBuilding, FaBasketballBall } from 'react-icons/fa';

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
      {/* <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4">{college.name}</h2> */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {college?.images?.slice(0, 3).map((img, index) => (
          <div
            key={`${img.id}-${index}`}
            className="mb-4"
            onClick={() => openModal(index)}
          >
            <img
              src={img?.image || "https://example.com/default-image.jpg"}
              alt={`College Image ${img?.id}`}
              className="rounded-lg object-cover w-full h-32 sm:h-40 md:h-48 lg:h-56 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {college?.images?.length > 3 && (
        <div className="col-span-3 text-center mt-2">
          <a
            href="#see-all-photos"
            className="text-blue-500 hover:underline"
            onClick={() => openModal(3)}
          >
            See All
          </a>
        </div>
      )}

      {isValidIndex && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-lg p-6 max-w-3xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={college.images[selectedImageIndex]?.image || "https://example.com/default-image.jpg"}
              alt={`College Image ${college.images[selectedImageIndex]?.id}`}
              className="w-full h-auto object-contain"
            />

            {college?.images?.length > 1 && selectedImageIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
              >
                &#8592; Prev
              </button>
            )}

            {college?.images?.length > 1 && selectedImageIndex < college.images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
              >
                Next &#8594;
              </button>
            )}

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
  );
};








  
  
const Courses = ({ college }) => (
  <div id="courses" className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mb-12">
    <h2 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-gray-800">Courses</h2>
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




  
  
const HighlightTable = ({ college }) => {
  return (
    <div className="overflow-hidden rounded-lg shadow-lg mb-8">
      <table className="min-w-full bg-white border border-gray-200">
        <tbody>
          <tr className="border-b hover:bg-gray-50 transition-all duration-200">
            <td className="py-4 px-6 font-semibold text-gray-700 bg-gray-100 flex items-center gap-2">
              <FaUniversity className="text-blue-500" /> College
            </td>
            <td className="py-4 px-6">{college.name}</td>
          </tr>

          <tr className="border-b hover:bg-gray-50 transition-all duration-200">
            <td className="py-4 px-6 font-semibold text-gray-700 bg-gray-100 flex items-center gap-2">
              <FaCalendar className="text-green-500" /> Year of Establishment
            </td>
            <td className="py-4 px-6">{college.year || 'N/A'}</td>
          </tr>

          <tr className="border-b hover:bg-gray-50 transition-all duration-200">
            <td className="py-4 px-6 font-semibold text-gray-700 bg-gray-100 flex items-center gap-2">
              <FaCrown className="text-yellow-500" /> Ownership
            </td>
            <td className="py-4 px-6">{college.ownership || 'N/A'}</td>
          </tr>

          <tr className="hover:bg-gray-50 transition-all duration-200">
            <td className="py-4 px-6 font-semibold text-gray-700 bg-gray-100 flex items-center gap-2">
              {college.approval ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
              Approval
            </td>
            <td className="py-4 px-6">{college.approval || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};





// facilities
const facilitiesData = [
  { name: 'Smart class', icon: <FaChalkboardTeacher /> },
  { name: 'Wifi', icon: <FaWifi /> },
  { name: 'Hostel', icon: <FaBed /> },
  { name: 'Parking', icon: <FaParking /> },
  { name: 'Indoor stadium', icon: <FaBasketballBall /> },
  { name: 'Football ground', icon: <FaFootballBall /> },
  { name: 'Library', icon: <FaBook /> },
  { name: 'Laboratory', icon: <FaFlask /> },
  { name: 'Ragging free campus', icon: <FaShieldAlt /> },
];

const Facilities = () => {
  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mt-12">
      <h2 className="text-3xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-8">Facilities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {facilitiesData.map((facility, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow hover:bg-blue-800 hover:text-white transition-transform transform hover:scale-105 cursor-pointer"
          >
            <div className="text-4xl mb-4">{facility.icon}</div>
            <p className="text-lg font-semibold">{facility.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};




// Description Component
const Description = ({ college }) => {
  if (!college || !college.name || !college.description) {
    return <p>Loading...</p>;
  }

  return (
    <div id="description" className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-12">
      {/* Heading */}
      <h1 className="text-2xl sm:text-xl md:text-3xl font-medium text-gray-800 mb-4">
        {college.name}
      </h1>

      {/* Highlight Table with Styling */}
      <div className="mb-8">
        <HighlightTable college={college} />
      </div>

      {/* Description */}
      <p
        className="mt-4 text-base sm:text-sm md:text-lg text-gray-600 break-words overflow-hidden leading-relaxed"
        dangerouslySetInnerHTML={{ __html: college.description }}
      ></p>

      {/* Location & Directions */}
      {college.location && (
        <div className="mt-4">
          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(college.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 mt-4 bg-blue-800 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Get Directions
          </a>
        </div>
      )}

      {/* Facilities Component */}
      <Facilities />

      {/* YouTube Video */}
      {college.youtube_link && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Watch Video Tour</h2>
          <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={
                college.youtube_link.includes("youtu.be")
                  ? `https://www.youtube.com/embed/${college.youtube_link.split('/').pop().split('?')[0]}`
                  : college.youtube_link.replace("watch?v=", "embed/").split('&')[0]
              }
              title="College Video"
              allowFullScreen
            ></iframe>
          </div>
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



    
  
  


export { Courses, Description, Fees,Photos,HighlightTable };
