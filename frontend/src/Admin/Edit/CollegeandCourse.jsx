import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';

const EditCollegeDetail = () => {
  const { collegeId } = useParams();
  const [college, setCollege] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCourse, setEditedCourse] = useState({});
  const baseURL = config.API_URL;
  const token = 'YOUR_TOKEN_HERE';
  const navigate = useNavigate();

  // Fetch college details
  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/colleges/${collegeId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCollege(response.data);
      } catch (error) {
        console.error('Error fetching college details:', error);
      }
    };

    fetchCollegeDetails();
  }, [collegeId, baseURL, token]);

  const handleEdit = () => {
    navigate(`/college/${collegeId}/edit`);
  };

  const openModal = (course) => {
    setSelectedCourse(course);
    setEditedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setEditedCourse({});
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse((prev) => ({ ...prev, [name]: value }));
  };

  const saveEditedCourse = async () => {
    try {
      await axios.put(
        `${baseURL}/api/college_courses/${selectedCourse.id}/`,
        editedCourse,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setCollege((prevCollege) => ({
        ...prevCollege,
        college_courses: prevCollege.college_courses.map((course) =>
          course.id === selectedCourse.id ? { ...course, ...editedCourse } : course
        ),
      }));
      closeModal();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div className="p-8">
      {college ? (
        <>
          <h1 className="text-3xl font-semibold mb-6">{college.name}</h1>
          <div className="mb-6">
            <h2 className="text-2xl font-medium mb-4">Courses</h2>
            {/* Display courses as a table */}
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Course Name</th>
                  <th className="border border-gray-300 px-4 py-2">Fees</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {college.college_courses && college.college_courses.length > 0 ? (
                  college.college_courses.map((course) => (
                    <tr key={course.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {course.course?.name || 'Unknown Course'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">₹{course.fees}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => openModal(course)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No courses available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* <button
            onClick={handleEdit}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
          >
            Edit College Details
          </button> */}
        </>
      ) : (
        <p>Loading college details...</p>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Course Name</label>
              <input
                type="text"
                name="name"
                value={editedCourse.course?.name || ''}
                onChange={handleModalInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Fees</label>
              <input
                type="number"
                name="fees"
                value={editedCourse.fees || ''}
                onChange={handleModalInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedCourse}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCollegeDetail;
