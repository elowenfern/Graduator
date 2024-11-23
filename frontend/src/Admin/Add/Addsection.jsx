import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SectionTable = () => {
  const [sections, setSections] = useState([]); // Initialize as empty array
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [validationError, setValidationError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null); // Track section to delete
  const baseURL = process.env.REACT_APP_API_URL;

  // Fetch colleges and sections from the API
  const fetchCollegesAndSections = async () => {
    try {
      const collegesResponse = await axios.get(`${baseURL}/api/colleges/`);
      setColleges(collegesResponse.data);

      const sectionsResponse = await axios.get(`${baseURL}/api/sections/`);
      setSections(sectionsResponse.data); // Ensure the sections data is properly set
    } catch (error) {
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchCollegesAndSections();
  }, []);

  // Handle add section
  const handleAddSection = async () => {
    if (!selectedColleges[0]) {
      setValidationError('Please select a college.');
      return;
    }
  
    try {
      // Send a single college ID (not an array)
      const response = await axios.post(`${baseURL}/api/sections/`, {
        name: newSectionName,
        college: selectedColleges[0],  // Just the selected college ID (not an array)
      });
  
      fetchCollegesAndSections();  // Fetch updated sections
      setIsModalOpen(false);
      setValidationError('');
      setNewSectionName('');
      setSelectedColleges([]);
    } catch (err) {
      setError('An error occurred while adding the section.');
    }
  };
  
  // Handle delete section
  const handleDeleteSection = async () => {
    if (!sectionToDelete) return;

    try {
      await axios.delete(`${baseURL}/api/sections/${sectionToDelete.id}/`);
      fetchCollegesAndSections(); // Reload sections after deletion
      setDeleteConfirm(false);
      setSectionToDelete(null);
    } catch (error) {
      setError('Error deleting section');
    }
  };

  // Handle college selection
  const handleCollegeSelection = (event) => {
    const options = event.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedColleges(selected);
  };

  // Confirm delete modal
  const openDeleteModal = (section) => {
    setDeleteConfirm(true);
    setSectionToDelete(section); // Set the section to delete
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">College Sections</h2>
      {error && <p className="text-red-500">{error}</p>}
      {validationError && <p className="text-red-500">{validationError}</p>}

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        Add Section
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-xl text-gray-500"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Add Section</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="sectionName">Section Name:</label>
                <input
                  type="text"
                  id="sectionName"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Enter section name"
                />
              </div>
              <div>
                <label htmlFor="college">Select Colleges:</label>
                <select
                  id="college"
                  multiple
                  value={selectedColleges}
                  onChange={handleCollegeSelection}
                  className="border p-2 rounded w-full"
                >
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddSection}
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete the section: {sectionToDelete?.name}?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSection}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Section Name</th>
              <th className="border-b px-4 py-2">Colleges</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections && sections.length > 0 ? (
              sections.map((section) => (
                <tr key={section.id} className="hover:bg-gray-100">
                  <td className="border-b px-4 py-2">{section.name}</td>
                  <td className="border-b px-4 py-2">
                  {section.college_name || 'No college'}
                </td>
                  <td className="border-b px-4 py-2 flex space-x-2">
                    {/* <button
                      onClick={() => alert(`Edit section: ${section.name}`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button> */}
                    <button
                      onClick={() => openDeleteModal(section)} // Open delete confirmation modal
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No sections available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default SectionTable;
