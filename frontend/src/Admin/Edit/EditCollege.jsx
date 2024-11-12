import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import FacilitySelection from './FacilitySelection';



const EditCollege = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [college, setCollege] = useState({
    name: '',
    location: '',
    description: '',
    images: [],
    university: null, 
  });
  const [universities, setUniversities] = useState([]); // To store available universities
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const token = 'YOUR_TOKEN_HERE'; // Replace with token

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/editcolleges/${id}/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        setCollege(response.data);
        setSelectedFacilities(response.data.facilities.map(facility => facility.id));
      } catch (error) {
        console.error('Error fetching college:', error);
      }
    };

    const fetchUniversities = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/universities/', { // Adjust endpoint if necessary
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        setUniversities(response.data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    const fetchFacilities = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/facilities/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        setFacilities(response.data); // Set fetched facilities into state
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };

    fetchCollege();
    fetchUniversities();
    fetchFacilities();
  }, [id]);

  const handleUpdateCollege = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', college.name);
    formData.append('location', college.location);
    formData.append('description', college.description);
    formData.append('university', college.university);
    
    
    
    selectedFacilities.forEach(facilityId => {
      formData.append('facilities', Number(facilityId));
    });
    
    console.log('FormData Before Sending:', formData);


    const existingImageIds = college.images
      .filter((img) => !imagesToDelete.includes(img.id))
      .map((img) => img.id);
    formData.append('existing_images', JSON.stringify(existingImageIds));
    



    

    
    
   

    // Append new images under 'images'
    newImages.forEach((image) => {
      formData.append('images', image);
    });
    console.log('FormData Before Sending:', formData);

    // Send only IDs of existing images to keep
    
    
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      // Update college details
      const response = await axios.put(
        `http://localhost:8000/api/editcolleges/${college.id}/`,
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
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error message:', error.message);
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
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
          <label className="block text-gray-700 text-sm font-bold mb-2">Add New Images</label>
          <input 
            type="file" 
            onChange={handleImageUpload} 
            multiple 
            className="py-2 px-3 text-gray-700 border rounded"
          />
        </div>

        {/* Update College button */}
        <div className="mt-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update College
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCollege;
