import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export const AddColleges = () => {
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [collegeName, setCollegeName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [universities, setUniversities] = useState([]); // State to store fetched universities
  const [facilities, setFacilities] = useState([]); // State to store fetched facilities
  const [selectedUniversity, setSelectedUniversity] = useState(''); // State for selected university
  const [selectedFacilities, setSelectedFacilities] = useState([]); // State for selected facilities
  const [error, setError] = useState('');

  // Fetch existing universities from the API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/universities/');
        const data = await response.json();
        setUniversities(data); // Populate universities
      } catch (err) {
        setError('Failed to fetch universities');
      }
    };

    fetchUniversities();
  }, []);

  // // Fetch existing facilities from the API
  // useEffect(() => {
  //   const fetchFacilities = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8000/api/facilities/');
  //       const data = await response.json();
  //       setFacilities(data); // Populate facilities
  //     } catch (err) {
  //       setError('Failed to fetch facilities');
  //     }
  //   };

  //   fetchFacilities();
  // }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // const handleFacilityChange = (e) => {
  //   const { value, checked } = e.target;
  //   setSelectedFacilities((prevSelectedFacilities) =>
  //     checked
  //       ? [...prevSelectedFacilities, value]
  //       : prevSelectedFacilities.filter((facility) => facility !== value)
  //   );
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    // Create FormData object
    const formData = new FormData();
    formData.append('name', collegeName);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('university', selectedUniversity); // Add selected university

  
    // formData.append('facilities', selectedFacilities.join(','));
   
    images.forEach((image) => {
      formData.append('images', image); // Append each image to the form data
    });

    // Existing images (if any) that you want to send along with the new data
    const existingImages = [1, 2]; // Ensure these are integers (not strings)
    formData.append('existing_images', JSON.stringify(existingImages));

    // Get the authentication token (make sure you replace it with the actual token)
    const token = localStorage.getItem("access_token"); // Replace with your actual token

    try {
      // Send POST request with Authorization header
      const response = await fetch('http://localhost:8000/api/colleges/', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`, // Add the token here
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add college');
      }

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      // Set error message if the submission fails
      setError(err.message || 'An error occurred while adding the college.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add College Details</h2>
      <div className="overflow-y-auto max-h-[70vh]"> {/* Scrollable container */}
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="collegeName">
              College Name
            </label>
            <input
              type="text"
              id="collegeName"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              rows="4"
            />
          </div>

          {/* Dropdown for selecting existing university */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="university">
              Select University
            </label>
            <select
              id="university"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
            >
              <option value="">-- Select University --</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>

          

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="images">
              College Images
            </label>
            <input
              type="file"
              id="images"
              onChange={handleImageChange}
              multiple
              className="mt-1 block w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              You can select multiple images.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add College
          </button>
        </form>

        {images.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Selected Images:</h3>
            <ul className="list-disc list-inside">
              {images.map((image, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {image.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
