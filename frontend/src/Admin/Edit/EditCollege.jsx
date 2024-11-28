import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import FacilitySelection from './FacilitySelection'; // Assuming this is a component for selecting facilities
import config from '../../config';
const EditCollege = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const baseURL = config.API_URL;

  const [college, setCollege] = useState({
    name: '',
    location: '',
    description: '',
    images: [],
    university: null,
    google_map_url: '', // Added Google Map URL field to state
  });
  const [universities, setUniversities] = useState([]); // To store available universities
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const token = 'YOUR_TOKEN_HERE'; // Replace with your token

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/editcolleges/${id}/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        setCollege(response.data);
        setSelectedFacilities(response.data.facilities.map(facility => facility.id)); // Assuming the API returns selected facilities
      } catch (error) {
        console.error('Error fetching college:', error);
      }
    };

    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/universities/`, { // Adjust endpoint if necessary
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        setUniversities(response.data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchCollege();
    fetchUniversities();
  }, [id]);

  const handleUpdateCollege = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', college.name);
    formData.append('location', college.location);
    formData.append('description', college.description);
    formData.append('university', college.university);
    formData.append('google_map_url', college.google_map_url); // Add Google Map URL to form data

    // Add facilities to the formData
    selectedFacilities.forEach(facilityId => {
      formData.append('facilities', Number(facilityId));
    });

    // Prepare images
    const existingImageIds = college.images
      .filter((img) => !imagesToDelete.includes(img.id))
      .map((img) => img.id);
    formData.append('existing_images', JSON.stringify(existingImageIds));

    newImages.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.put(
        `${baseURL}/api/editcolleges/${college.id}/`,
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Update response:', response.data);
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prevImages) => [...prevImages, ...files]);
  };

  const markImageForDeletion = (imageId) => {
    setImagesToDelete((prev) => [...prev, imageId]);
    setCollege((prevCollege) => ({
      ...prevCollege,
      images: prevCollege.images.filter((img) => img.id !== imageId),
    }));
  };

  if (!college || !college.name) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Edit College</h2>
      <form onSubmit={handleUpdateCollege} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-h-[80vh] overflow-y-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">College Name</label>
          <input
            type="text"
            id="name"
            value={college.name}
            onChange={(e) => setCollege({ ...college, name: e.target.value })}
            placeholder="College Name"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={college.location}
            onChange={(e) => setCollege({ ...college, location: e.target.value })}
            placeholder="Location"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={college.description}
            onChange={(e) => setCollege({ ...college, description: e.target.value })}
            placeholder="Description"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* University Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="university">University</label>
          <select
            id="university"
            value={college.university || ''}
            onChange={(e) => setCollege({ ...college, university: e.target.value })}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value=""></option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
        </div>

        {/* Google Map URL */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="googleMapUrl">Google Map URL</label>
          <input
            type="url"
            id="googleMapUrl"
            value={college.google_map_url}
            onChange={(e) => setCollege({ ...college, google_map_url: e.target.value })}
            placeholder="Google Map URL"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Display current images */}
        {college.images.map((img, index) => (
          <div key={`${img.id}-${index}`} className="mb-4 flex items-center space-x-4">
            <img 
              src={img.image} 
              alt={`College Image ${img.id}`} 
              className="w-20 h-20 object-cover rounded" 
            />
            <button 
              type="button" 
              onClick={() => markImageForDeletion(img.id)} 
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Upload new images */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">Upload Images</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageUpload}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update College
        </button>
      </form>
    </div>
  );
};

export default EditCollege;
