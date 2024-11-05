import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCollege = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [college, setCollege] = useState({
    name: '',
    location: '',
    description: '',
    images: []
  });
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
      } catch (error) {
        console.error('Error fetching college:', error);
      }
    };
    fetchCollege();
  }, [id]);

  const handleUpdateCollege = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', college.name);
    formData.append('location', college.location);
    formData.append('description', college.description);

    // Append new images under the same 'images' key
    newImages.forEach((image) => {
      formData.append('images', image);
    });

    // Send IDs of images to keep
    const existingImageIds = college.images
      .filter((img) => !imagesToDelete.includes(img.id))
      .map((img) => img.id);

    formData.append('existing_images', JSON.stringify(existingImageIds));

    try {
      // Delete images marked for deletion
      for (const imageId of imagesToDelete) {
        await axios.delete(`http://localhost:8000/api/college-images/${imageId}/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
      }

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
      console.error('Error updating college:', error);
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
      <form onSubmit={handleUpdateCollege} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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

        {/* Display current images */}
        {college.images.map((img, index) => (
          <div key={img.id} className="mb-4 flex items-center space-x-4">
            <img src={img.image} alt={`College Image ${index}`} className="w-20 h-20 object-cover rounded" />
            <button type="button" onClick={() => markImageForDeletion(img.id)} className="text-red-500">Remove</button>
          </div>
        ))}

        {/* Upload new images */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Add New Images</label>
          <input type="file" onChange={handleImageUpload} multiple className="py-2 px-3 text-gray-700 border rounded"/>
        </div>

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Update College
        </button>
      </form>
    </div>
  );
};

export default EditCollege;
