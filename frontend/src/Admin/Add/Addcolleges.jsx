import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import config from '../../config';

export const AddColleges = () => {
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [collegeName, setCollegeName] = useState('');
  const [slug, setSlug] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [universities, setUniversities] = useState([]); // State to store fetched universities
  const [selectedUniversity, setSelectedUniversity] = useState(''); // State for selected university
  const [google_map_url, setGoogleMapUrl] = useState(''); // State for Google Map URL
  const [year, setYear] = useState(''); // New state for Year of Establishment
  const [ownership, setOwnership] = useState(''); // New state for Ownership
  const [approval, setApproval] = useState(''); // New state for Approval
  const [logo, setLogo] = useState(null); // New state for Logo
  const [youtubeLink, setYoutubeLink] = useState(''); // New state for YouTube Link
  const [error, setError] = useState('');

  // Fetch existing universities from the API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/universities/`);
        const data = await response.json();
        setUniversities(data); // Populate universities
      } catch (err) {
        setError('Failed to fetch universities');
      }
    };

    fetchUniversities();
  }, []);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setLogo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    const cleanedSlug = slug.replace(/\s+/g, '-').toLowerCase();
    // Create FormData object
    const formData = new FormData();
    formData.append('name', collegeName);
    formData.append('slug', cleanedSlug);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('university', selectedUniversity);
    formData.append('google_map_url', google_map_url);
    formData.append('year', year);
    formData.append('ownership', ownership);
    formData.append('approval', approval);
    formData.append('youtube_link', youtubeLink);

    if (logo) {
      formData.append('logo', logo); // Add logo file
    }

    images.forEach((image) => {
      formData.append('images', image); 
    });

    const token = localStorage.getItem("access_token"); 

    try {
      // Send POST request with Authorization header
      const response = await fetch(`${config.API_URL}/api/colleges/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`, // Add the token here
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Failed to add college');
      }

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
            <label className="block text-sm font-medium text-gray-700" htmlFor="slug">
              College name in small letters
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="year_of_establishment">
              Year of Establishment
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              placeholder="Enter year"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="ownership">
              Ownership
            </label>
            <input
              type="text"
              id="ownership"
              value={ownership}
              onChange={(e) => setOwnership(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              placeholder="Enter ownership type (e.g., Government, Private)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="approval">
              Approval
            </label>
            <input
              type="text"
              id="approval"
              value={approval}
              onChange={(e) => setApproval(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              placeholder="Enter approval details (e.g., UGC Approved)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="logo">
              College Logo
            </label>
            <input
              type="file"
              id="logo"
              onChange={handleLogoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="youtubeLink">
              YouTube Link
            </label>
            <input
              type="url"
              id="youtubeLink"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              placeholder="Enter YouTube link"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="images">
              College Images
            </label>
            <input
              type="file"
              id="images"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="university">
              University
            </label>
            <select
              id="university"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              required
            >
              <option value="">Select University</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="google_map_url">
              Google Map URL
            </label>
            <input
              type="url"
              id="google_map_url"
              value={google_map_url}
              onChange={(e) => setGoogleMapUrl(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              placeholder="Enter Google Map URL"
            />
          </div>
          {/* display error message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            Add College
          </button>
        </form>
      </div>
    </div>
  );
};
