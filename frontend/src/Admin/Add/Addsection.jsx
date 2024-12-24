import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

const SectionTable = () => {
  const [sections, setSections] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [deleteSectionId, setDeleteSectionId] = useState(null);

  const baseURL = config.API_URL;

  // Fetch colleges, courses, and sections
  const fetchData = async () => {
    try {
      const collegesResponse = await axios.get(`${baseURL}/api/colleges/`);
      console.log('Colleges:', collegesResponse.data);
  
      const coursesResponse = await axios.get(`${baseURL}/api/courses/`);
      console.log('Courses:', coursesResponse.data);
  
      const sectionsResponse = await axios.get(`${baseURL}/api/sections/`);
      console.log('Sections:', sectionsResponse.data);
  
      setColleges(collegesResponse.data);
      setCourses(coursesResponse.data);
      setSections(sectionsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    }
  };
  useEffect(() => {
    fetchData();
}, []);

  
  // Handle opening Add Section Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewSectionName('');
    setSelectedCollege('');
    setSelectedCourse('');
  };

  const handleAddSection = async () => {
    if (!newSectionName || (!selectedCollege && !selectedCourse)) {
      setError('Please provide valid data');
      console.error('Validation failed:', { newSectionName, selectedCollege, selectedCourse });
      return;
    }
  
    const payload = {
      name: newSectionName,
      college_id: selectedCollege ? selectedCollege : null,
      course_id: selectedCourse || null,
    };
  
    console.log('Payload:', payload);
  
    try {
      const response = await axios.post(`${baseURL}/api/sections/`, payload);
      console.log('Response from API:', response.data);
  
      closeAddModal();
      fetchData(); // Refresh sections
      setError('');
    } catch (error) {
      console.error('Error adding section:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Unexpected error occurred');
      }
    }
  };
  

  // Handle Delete
  const handleOpenDeleteModal = (id) => {
    setDeleteSectionId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (deleteSectionId) {
      try {
        await axios.delete(`${baseURL}/api/sections/${deleteSectionId}/`);
        fetchData(); // Refresh sections
        setIsDeleteModalOpen(false);
        setDeleteSectionId(null);
      } catch (error) {
        setError('Failed to delete section. Please try again.');
        console.error('Error deleting section:', error);
      }
    }
  };

  

  const handleCancelDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteSectionId(null);
  };
  useEffect(() => {
    console.log(sections);
  }, [sections]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">College Sections</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Button to open the Add Section Modal */}
      <button
        onClick={openAddModal}
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        Add Section
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Section Name</th>
              <th className="border-b px-4 py-2">Colleges</th>
              <th className="border-b px-4 py-2">Courses</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.length > 0 ? (
              sections.map((section) => (
                <tr key={section.id} className="hover:bg-gray-100">
                  <td className="border-b px-4 py-2">{section.name}</td>
                  <td className="border-b px-4 py-2">{section.college_name|| 'N/A'}</td>
                  <td className="border-b px-4 py-2">{section.course_name || 'N/A'}</td>
                  <td className="border-b px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleOpenDeleteModal(section.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No sections available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Section Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Section</h2>
            <div className="space-y-4">
              <label>Section Name</label>
              <input
                className="border p-2 rounded w-full"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Enter Section Name"
              />

              <label>Select College</label>
              <select
                className="border p-2 rounded w-full"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
              >
                <option value="">Select a college</option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name}
                  </option>
                ))}
              </select>

              <label>Select Course</label>
              <select
                className="border p-2 rounded w-full"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
               <option value="">Select a course</option>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No courses available</option>
                  )}
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={closeAddModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSection}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this section?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleCancelDeleteModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
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

export default SectionTable;
