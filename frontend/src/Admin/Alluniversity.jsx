import React, { useEffect, useState } from "react";
import config from "../config";
const AllUniversity = () => {
  const [universities, setUniversities] = useState([]);
  const [editUniversity, setEditUniversity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);


  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    established_year: "",
    website: "",
    image: null, // Image field for file uploads
  });

  // Fetch universities from API
  const fetchUniversities = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/universities/`);
      const data = await response.json();
      setUniversities(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  // Handle edit button click
  const handleEditClick = (university) => {
    setEditUniversity(university);
    console.log("Edit University:", university); // Log the entire university object to check if image exists
    setFormData({
      name: university.name,
      location: university.location,
      description: university.description || "",
      established_year: university.established_year || "",
      website: university.website || "",
      image: null, // Set to null initially
    });
    setIsModalOpen(true);
  };

  // Handle delete button click - open the confirmation modal
  const handleDeleteClick = (university) => {
    setUniversityToDelete(university); // Set the university to delete
    setIsDeleteModalOpen(true); // Open delete confirmation modal
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Handle file input for the image field
    });
  };

  // Handle form submission for editing
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Log the formData being submitted
    console.log("Form Data before submitting:", formData);

    // Use FormData for file upload
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        formDataObj.append(key, formData[key]);
      }
    });

    // Log the FormData to check if the image is included
    console.log("FormData being submitted:", formDataObj);

    try {
      await fetch(`${config.API_URL}/api/universities/${editUniversity.id}/`, {
        method: "PUT",
        body: formDataObj,
      });
      setIsModalOpen(false);
      fetchUniversities(); // Refresh the list
    } catch (error) {
      console.error("Error updating university:", error);
    }
  };

  // Confirm delete action and delete university
  const handleConfirmDelete = async () => {
    if (universityToDelete) {
      try {
        await fetch(`${config.API_URL}/api/universities/${universityToDelete.id}/`, {
          method: "DELETE",
        });
        fetchUniversities(); // Refresh the list
        setIsDeleteModalOpen(false); // Close the delete confirmation modal
      } catch (error) {
        console.error("Error deleting university:", error);
      }
    }
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // Close the delete confirmation modal
  };

  // Fetch universities on component mount
  useEffect(() => {
    fetchUniversities();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Universities</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-r">Name</th>
            <th className="py-2 px-4 border-b border-r">Location</th>
            <th className="py-2 px-4 border-b border-r">Established Year</th>
            <th className="py-2 px-4 border-b border-r">Website</th>
            <th className="py-2 px-4 border-b border-r">Image</th>
            <th className="py-2 px-4 border-b border-r">Actions</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => (
            <tr key={university.id}>
              <td className="py-2 px-4 border-b border-r">{university.name}</td>
              <td className="py-2 px-4 border-b border-r">{university.location}</td>
              <td className="py-2 px-4 border-b border-r">{university.established_year}</td>
              <td className="py-2 px-4 border-b border-r">
                {university.website ? (
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Visit Website
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="py-2 px-4 border-b border-r">
                {university.image ? (
                    <div>
                    {console.log('Image URL:', university.image)} {/* Log the image URL */}
                    <img
                        src={university.image}
                        alt={university.name}
                        className="w-16 h-16 object-cover rounded"
                    />
                    </div>
                ) : (
                    "No Image"
                )}
                </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditClick(university)}
                  className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(university)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit University</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="University Name"
                className="block w-full p-2 border border-gray-300 rounded-md mb-2"
                required
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="Location"
                className="block w-full p-2 border border-gray-300 rounded-md mb-2"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Description"
                className="block w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <input
                type="number"
                name="established_year"
                value={formData.established_year}
                onChange={handleFormChange}
                placeholder="Established Year"
                className="block w-full p-2 border border-gray-300 rounded-md mb-2"
                required
              />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleFormChange}
                placeholder="Website"
                className="block w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Current Image:</label>
                {editUniversity.image ? (
                  <>
                    <img
                      src={editUniversity.image}
                      alt="Current"
                      className="w-20 h-20 object-cover rounded mb-2"
                    />
                  </>
                ) : (
                  <p className="text-gray-500">No image uploaded</p>
                )}
                <label className="block text-sm font-medium mb-2">Upload New Image:</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFormChange}
                  className="block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this university?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUniversity;
