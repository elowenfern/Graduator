import React, { useState, useEffect } from "react";
import config from "../config";
import { Link } from "react-router-dom";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const categoryOptions = [
    { value: 'science', label: 'Science' },
    { value: 'arts', label: 'Arts' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'management', label: 'Management' },
    { value: 'medical', label: 'Medical' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'law', label: 'Law' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'paramedical', label: 'Paramedical' },
    { value: 'design', label: 'Design' },
    { value: 'allied health science', label: 'Allied Health Science' },
    { value: 'veterinary', label: 'Veterinary' },
  ];
  
  
  // Fetch all courses from the API
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/courses/`, {
        headers: {
          "Authorization": `Token YOUR_TOKEN_HERE`, // Replace with actual token
        },
      });
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Handle delete button click - open the confirmation modal for course deletion
  const handleDeleteClick = (course) => {
    setCourseToDelete(course); // Set the course to delete
    setIsDeleteModalOpen(true); // Open delete confirmation modal
  };

  // Confirm delete action and delete course
  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      try {
        await fetch(`${config.API_URL}/api/courses/${courseToDelete.id}/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Token YOUR_TOKEN_HERE`, // Replace with actual token
          },
        });

        // Remove the deleted course from the courses state
        setCourses(courses.filter((course) => course.id !== courseToDelete.id));
        setIsDeleteModalOpen(false); // Close the delete confirmation modal
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // Close the delete confirmation modal
  };

  const handleEditClick = (course) => {
    setCourseToEdit(course); 
    setImagePreview(course.image || null); 
    setIsEditModalOpen(true); 
  };

  // Handle image preview change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setCourseToEdit({ ...courseToEdit, image: file }); // Set the file to course object
    }
  };



  
  const handleEditSubmit = async (updatedCourse) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedCourse.name);
  
      // Ensure that the image is a File instance before appending it to FormData
      if (updatedCourse.image instanceof File) {
        formData.append("image", updatedCourse.image);
      } else if (updatedCourse.image) {
        // Handle case where image exists but is not a File (e.g., image URL)
        console.error("Invalid image type: ", updatedCourse.image);
      }
  
      formData.append("semester", updatedCourse.semester);
      formData.append("years", updatedCourse.years);
      formData.append("category", updatedCourse.category);
  
      const response = await fetch(`${config.API_URL}/api/courses/${updatedCourse.id}/`, {
        method: "PUT",
        headers: {
          "Authorization": `Token YOUR_TOKEN_HERE`,  // Use the actual token
        },
        body: formData,  // Send FormData (multipart/form-data)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update course in the state
        setCourses(courses.map((course) => (course.id === data.id ? data : course)));
        setIsEditModalOpen(false); // Close modal
      } else {
        console.error("Error updating course:", data);
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };
  

  // Cancel edit action
  const handleCancelEdit = () => {
    setIsEditModalOpen(false); // Close the edit modal
  };

  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Courses</h1>
      <table className="min-w-full bg-white border border-gray-200 mb-6">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Semester</th>
            <th className="py-2 px-4 border-b">Year</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id}>
                <td className="py-2 px-4 border-b">{course.id}</td>
                <td className="py-2 px-4 border-b">{course.name}</td>
                <td className="py-2 px-4 border-b">
                  {course.image && (
                    <img src={course.image} alt={course.name} className="w-16 h-16 object-cover" />
                  )}
                </td>
                <td className="py-2 px-4 border-b">{course.semester}</td>
                <td className="py-2 px-4 border-b">{course.years}</td>
                <td className="py-2 px-4 border-b">{course.category}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditClick(course)}
                    className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(course)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-2 px-4 text-center">
                No courses found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this course?</p>
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

      {/* Modal for Edit Course */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Course</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit(courseToEdit);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Course Name</label>
                <input
                  type="text"
                  value={courseToEdit?.name || ""}
                  onChange={(e) =>
                    setCourseToEdit({ ...courseToEdit, name: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <input
                  type="text"
                  value={courseToEdit?.semester || ""}
                  onChange={(e) =>
                    setCourseToEdit({ ...courseToEdit, semester: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="text"
                  value={courseToEdit?.years || ""}
                  onChange={(e) =>
                    setCourseToEdit({ ...courseToEdit, years: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    value={courseToEdit?.category || ""}
                    onChange={(e) =>
                      setCourseToEdit({ ...courseToEdit, category: e.target.value })
                    }
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>

              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Save Changes
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
