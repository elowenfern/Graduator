import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CoursesPage = () => {
  const { collegeId } = useParams(); // Get the college ID from the URL
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [updatedCourseData, setUpdatedCourseData] = useState({
    name: '',
    description: '',
    fees: '',
    semester: '',
    years: '',
    category: '',
  });
  const [deletingCourse, setDeletingCourse] = useState(null); // Track course being deleted
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Show confirmation modal
  const token = localStorage.getItem("access_token");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/courses/?college_id=${collegeId}&page=${page}`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setCourses((prevCourses) => [...prevCourses, ...response.data]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [collegeId, page]);

  const handleScroll = (e) => {
    if (
      e.target.documentElement.scrollHeight === e.target.documentElement.scrollTop + window.innerHeight &&
      hasMore && !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  const handleEditCourse = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/courses/${editingCourse.id}/`, updatedCourseData, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      const updatedCourses = courses.map((course) =>
        course.id === editingCourse.id ? { ...course, ...updatedCourseData } : course
      );
      setCourses(updatedCourses);
      setEditingCourse(null);
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course');
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/courses/${deletingCourse.id}/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      // Remove deleted course from the list
      setCourses((prevCourses) => prevCourses.filter(course => course.id !== deletingCourse.id));
      setDeletingCourse(null); // Close the confirmation modal
      setShowDeleteConfirmation(false); // Close the modal
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course');
    }
  };

  if (loading && page === 1) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sortedCourses = courses.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Courses for College {collegeId}</h2>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Course Name</th>
            <th className="py-2 px-4 border-b">Fee</th>
            <th className="py-2 px-4 border-b">Semester</th>
            <th className="py-2 px-4 border-b">Years</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            sortedCourses.map((course) => (
              <tr key={course.id}>
                <td className="py-2 px-4 border-b">{course.id}</td>
                <td className="py-2 px-4 border-b">{course.name}</td>
                <td className="py-2 px-4 border-b">{course.fees}</td>
                <td className="py-2 px-4 border-b">{course.semester}</td>
                <td className="py-2 px-4 border-b">{course.years}</td>
                <td className="py-2 px-4 border-b">{course.category}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                    onClick={() => {
                      setEditingCourse(course);
                      setUpdatedCourseData({
                        name: course.name,
                        description: course.description,
                        fees: course.fees,
                        semester: course.semester,
                        years: course.years,
                        category: course.category,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => {
                      setDeletingCourse(course);
                      setShowDeleteConfirmation(true); // Show the delete confirmation modal
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-2 px-4 text-center">No courses found</td>
            </tr>
          )}
        </tbody>
      </table>

      {loading && <div>Loading more courses...</div>}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this course?</h3>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteCourse}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-lg font-semibold mb-4">Edit Course</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium">Course Name</label>
              <input
                type="text"
                value={updatedCourseData.name}
                onChange={(e) => setUpdatedCourseData({ ...updatedCourseData, name: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={updatedCourseData.description}
                onChange={(e) => setUpdatedCourseData({ ...updatedCourseData, description: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Fees</label>
              <input
                type="text"
                value={updatedCourseData.fees}
                onChange={(e) => setUpdatedCourseData({ ...updatedCourseData, fees: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Semester</label>
              <input
                type="text"
                value={updatedCourseData.semester}
                onChange={(e) => setUpdatedCourseData({ ...updatedCourseData, semester: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Years</label>
              <input
                type="text"
                value={updatedCourseData.years}
                onChange={(e) => setUpdatedCourseData({ ...updatedCourseData, years: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Category</label>
              <input
                type="text"
                value={updatedCourseData.category}
                onChange={(e) => setUpdatedCourseData({ ...updatedCourseData, category: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleEditCourse}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingCourse(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
