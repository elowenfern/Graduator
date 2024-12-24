import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import FacilitySelection from './FacilitySelection'; // Assuming this is a component for selecting facilities
import config from '../../config';
import WordSelection from './WordSelection'; // Importing WordSelection component



const EditCollege = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = config.API_URL;
  const [error, setError] = useState('');
  const [college, setCollege] = useState({
    name: '',
    slug: '',
    location: '',
    description: '',
    images: [],
    university: null,
    google_map_url: '',
    year: '',
    ownership: '',
    approval: '',
    logo: null,
    youtube_link: ''
  });
  const [universities, setUniversities] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]); // State for selected words
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
      } catch (error) {
        console.error('Error fetching college:', error);
      }
    };

    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/universities/`, { 
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



  const addRandomInterlinks = (description, selectedWords) => {
    let updatedDescription = description;
    selectedWords.forEach((wordObj) => {
      const { word, url } = wordObj;
      const regex = new RegExp(`\\b${word}\\b`, 'g'); // Match whole word
      updatedDescription = updatedDescription.replace(
        regex,
        `<a href="${url}" target="_blank" class="text-blue-500 underline"">${word}</a>`
      );
    });
    return updatedDescription;
  };


  const handleUpdateCollege = async (event) => {
    event.preventDefault();
    const expectedSlug = college.name.replace(/\s+/g, '-').toLowerCase();
    if (college.slug !== expectedSlug) {
        setError(`Slug must match the college name in lowercase and hyphenated form: ${expectedSlug}`);
        return;
    }
    setError('');

    const updatedDescription = addRandomInterlinks(college.description, selectedWords); // Use selectedWords for interlinking

    const formData = new FormData();
    formData.append('name', college.name);
    if (college.slug === expectedSlug) {
      formData.append('slug', college.slug);
    }
    formData.append('location', college.location);
    formData.append('description', updatedDescription);
    formData.append('university', college.university);
    formData.append('google_map_url', college.google_map_url);

    const year = parseInt(college.year, 10);
    formData.append('year', !isNaN(year) ? year : '');
    formData.append('ownership', college.ownership);
    formData.append('approval', college.approval);
    if (college.logo instanceof File) {
      formData.append('logo', college.logo);
    }
    formData.append('youtube_link', college.youtube_link);

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
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to update college. Please try again later.');
      console.error('Error data:', error.response.data);
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">College Slug (Lowercase)</label>
          <input
            type="text"
            id="slug"
            value={college.slug}
            onChange={(e) => setCollege({ ...college, slug: e.target.value })}
            placeholder="College Name in Lowercase"
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

        <WordSelection words={['word1', 'word2']} onAddLink={addRandomInterlinks} />

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

        {/* New fields */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            value={college.year}
            onChange={(e) => setCollege({ ...college, year: e.target.value })}
            placeholder="Year"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ownership">Ownership</label>
          <input
            type="text"
            id="ownership"
            value={college.ownership}
            onChange={(e) => setCollege({ ...college, ownership: e.target.value })}
            placeholder="Ownership"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="approval">Approval</label>
          <input
            type="text"
            id="approval"
            value={college.approval}
            onChange={(e) => setCollege({ ...college, approval: e.target.value })}
            placeholder="Approval"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Upload Logo */}
        {/* Display current logo if exists */}
        {college.logo && (
          <div className="mb-4 flex items-center space-x-4">
            <img 
              src={college.logo} // Assuming the logo URL is stored in college.logo
              alt="College Logo"
              className="w-20 h-20 object-cover rounded"
            />
            <button 
              type="button" 
              onClick={() => setCollege({ ...college, logo: null })} 
              className="text-red-500"
            >
              Remove Logo
            </button>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logo">College Logo</label>
          <input
            type="file"
            id="logo"
            onChange={(e) => setCollege({ ...college, logo: e.target.files[0] })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* YouTube Link */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="youtube_link">YouTube Link</label>
          <input
            type="url"
            id="youtube_link"
            value={college.youtube_link}
            onChange={(e) => setCollege({ ...college, youtube_link: e.target.value })}
            placeholder="YouTube Link"
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

        {/* Error message */}
        {error && (
          <div className="mb-4 text-red-500 text-sm font-bold">
            {error}
          </div>
        )}

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
