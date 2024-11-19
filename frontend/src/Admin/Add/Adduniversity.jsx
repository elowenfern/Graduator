import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddUniversity = () => {
  const navigate = useNavigate();
  const [universityName, setUniversityName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [website, setWebsite] = useState('');
  const [image, setImage] = useState(null); // State for the image file
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    const formData = new FormData();
    formData.append('name', universityName);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('established_year', establishedYear);
    formData.append('website', website);
    if (image) {
      formData.append('image', image); // Append the image file
    }

    try {
      const response = await fetch('http://localhost:8000/api/universities/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add university');
      }

      const universityData = await response.json();
      // After success, redirect to the university list or another page
      navigate('/dashboard'); // Change to the desired redirect path
    } catch (err) {
      setError('Error adding university');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add University</h2>

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="University Name"
          value={universityName}
          onChange={(e) => setUniversityName(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md mb-2"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md mb-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md mb-2"
          required
        />
        <input
          type="number"
          placeholder="Established Year"
          value={establishedYear}
          onChange={(e) => setEstablishedYear(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md mb-2"
          required
        />
        <input
          type="url"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])} // Update state with the selected file
          className="block w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
        >
          Add University
        </button>
      </form>
    </div>
  );
};
