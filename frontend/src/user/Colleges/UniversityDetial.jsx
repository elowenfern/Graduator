import React from 'react';

const UniversityDetail = ({ university }) => {
  if (!university) return <div>Loading...</div>; // Show loading if no university data

  const { name, image, description, established_year, website, location } = university;

  console.log('University Data:', university); // Log the university data to verify it's received

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mb-12">
      {/* University Name */}
      <h1 className="text-3xl sm:text-2xl md:text-4xl font-bold text-gray-800">{name}</h1>

      {/* University Image */}
      {image ? (
        <img
          src={image} // Ensure the image URL is correctly formed
          alt={name}
          className="w-full h-64 object-cover rounded-lg mt-4 mb-6"
        />
      ) : (
        <div className="w-full h-64 bg-gray-300 flex justify-center items-center text-white rounded-lg mb-6">
          No Image Available
        </div>
      )}

      {/* University Description */}
      <p className="mt-4 text-base sm:text-sm md:text-lg text-gray-600 break-words">{description}</p>

      {/* University Established Year */}
      <div className="mt-4 text-base sm:text-sm md:text-lg text-gray-600">
        <strong>Established Year:</strong> {established_year || "N/A"}
      </div>

      {/* University Website */}
      {website && (
        <div className="mt-4 text-base sm:text-sm md:text-lg text-gray-600">
          <strong>Website:</strong>{' '}
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {website}
          </a>
        </div>
      )}

      {/* University Location */}
      <div className="mt-4 text-base sm:text-sm md:text-lg text-gray-600">
        <strong>Location:</strong> {location || "Location not provided"}
      </div>
    </div>
  );
};

export default UniversityDetail;
