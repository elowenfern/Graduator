import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CoursesPage = () => {
  const { collegeId } = useParams(); // Get the college ID from the URL
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false); // For managing the edit modal visibility
  const [selectedCourse, setSelectedCourse] = useState(null); // Store selected course for editing
  const token = localStorage.getItem("access_token");

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/courses/?college_id=${collegeId}`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
      setLoading(false);
    }
  };

  // Delete course
  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:8000/api/courses/${courseId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course');
    }
  };

  // Update course (edit)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, fee, semester, years } = e.target;
      await axios.put(`http://localhost:8000/api/courses/${selectedCourse.id}/`, {
        name: name.value,
        fee: fee.value,
        semester: semester.value, // Send the semester field
        years: years.value, // Send the years field
      }, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setEditModalOpen(false); // Close the modal after successful update
      fetchCourses(); // Re-fetch the courses to get updated data
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [collegeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Courses for College {collegeId}</h2>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Course Name</th>
            <th className="py-2 px-4 border-b">Fee</th>
            <th className="py-2 px-4 border-b">Semester</th> {/* New column for semester */}
            <th className="py-2 px-4 border-b">Years</th> {/* New column for years */}
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id}>
                <td className="py-2 px-4 border-b">{course.id}</td>
                <td className="py-2 px-4 border-b">{course.name}</td>
                <td className="py-2 px-4 border-b">{course.fees}</td>
                <td className="py-2 px-4 border-b">{course.semester}</td> {/* Display semester */}
                <td className="py-2 px-4 border-b">{course.years}</td> {/* Display years */}
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                    onClick={() => {
                      setSelectedCourse(course);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-2 px-4 text-center">No courses found</td> {/* Adjust for the extra columns */}
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {isEditModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Edit Course</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">Course Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={selectedCourse.name}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="fee">Course Fee</label>
                <input
                  id="fee"
                  name="fee"
                  type="number"
                  defaultValue={selectedCourse.fees}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="semester">Semester</label>
                <input
                  id="semester"
                  name="semester"
                  type="number"
                  defaultValue={selectedCourse.semester}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="years">Years</label>
                <input
                  id="years"
                  name="years"
                  type="number"
                  defaultValue={selectedCourse.years}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded mr-2 hover:bg-gray-500"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
