import React, { useState, useEffect } from "react";
import config from "../../config";

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [colleges, setColleges] = useState({});
  const [allColleges, setAllColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", colleges: [] });
  const [confirmDelete, setConfirmDelete] = useState(null); // State to handle delete confirmation modal

  useEffect(() => {
    fetch(`${config.API_URL}/api/blogs/`)
      .then((response) => response.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);

        const collegeIds = data.flatMap((blog) => blog.colleges);
        fetch(`${config.API_URL}/api/colleges/by-ids?ids=${collegeIds.join(",")}`)
          .then((response) => response.json())
          .then((collegeData) => {
            const collegeMap = {};
            collegeData.forEach((college) => {
              collegeMap[college.id] = college;
            });
            setColleges(collegeMap);
          });

        fetch(`${config.API_URL}/api/colleges/`)
          .then((response) => response.json())
          .then((data) => setAllColleges(data));
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err); // Log full error for debugging
        setError("Failed to fetch blogs. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      colleges: blog.colleges,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCollegeChange = (collegeId) => {
    setFormData((prev) => {
      const colleges = prev.colleges.includes(collegeId)
        ? prev.colleges.filter((id) => id !== collegeId)
        : [...prev.colleges, collegeId];
      return { ...prev, colleges };
    });
  };

  const handleSave = () => {
    fetch(`${config.API_URL}/api/blogs/${editingBlog.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((updatedBlog) => {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
        );
        setEditingBlog(null);
      })
      .catch((err) => {
        console.error("Error updating blog:", err); // Log full error
        alert("Failed to update blog. Please try again.");
      });
  };

  const handleDelete = (id) => {
    fetch(`${config.API_URL}/api/blogs/${id}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setBlogs(blogs.filter((blog) => blog.id !== id)); // Remove the blog from the state
          setConfirmDelete(null); // Close the confirmation modal
        } else {
          throw new Error("Failed to delete blog.");
        }
      })
      .catch((err) => {
        console.error("Error deleting blog:", err); // Log full error
        alert("Failed to delete blog. Please try again.");
        setConfirmDelete(null); // Close the modal on error
      });
  };

  const handleConfirmDelete = (id) => {
    setConfirmDelete(id); // Set the blog id to be deleted
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null); // Close the confirmation modal without deleting
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Blogs</h1>

      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id} className="mb-6">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-600">{blog.description}</p>
              <div className="mt-2">
                <strong>Colleges:</strong>
                <ul>
                  {blog.colleges.map((collegeId) => {
                    const collegeDetails = colleges[collegeId];
                    return collegeDetails ? (
                      <li key={collegeId} className="text-sm text-gray-700">
                        {collegeDetails.name}
                      </li>
                    ) : (
                      <li key={collegeId} className="text-sm text-gray-700">
                        Loading college...
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={() => handleEditClick(blog)}
              >
                Edit
              </button>
              <button
                className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => handleConfirmDelete(blog.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this blog?</h2>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(confirmDelete)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {editingBlog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block mb-4">
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <div className="mb-4">
              <strong>Select Colleges:</strong>
              {allColleges.map((college) => (
                <div key={college.id} className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={formData.colleges.includes(college.id)}
                    onChange={() => handleCollegeChange(college.id)}
                    className="mr-2"
                  />
                  {college.name}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setEditingBlog(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={handleSave}
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

export default DisplayBlogs;
