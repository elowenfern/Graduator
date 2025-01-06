import React, { useState, useEffect } from "react";
import config from '../../config';

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [colleges, setColleges] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all colleges from the API
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/colleges/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch colleges. Status: ${response.status}`);
        }
        const data = await response.json();
        setColleges(data);  // Set all fetched colleges
        setLoading(false);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        alert("Unable to fetch colleges. Please try again later.");
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Handle selecting/unselecting colleges
  const handleCollegeSelection = (collegeId) => {
    setSelectedColleges((prev) =>
      prev.includes(collegeId)
        ? prev.filter((id) => id !== collegeId)
        : [...prev, collegeId]
    );
  };


  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!title || !description) {
      alert("Title and Description are required.");
      return;
    }
  
    if (selectedColleges.length === 0) {
      alert("Please select at least one college.");
      return;
    }
    
    console.log("Selected Colleges:", selectedColleges);
  
    // Ensure only IDs are sent
    const blogData = {
      title,
      description,
      colleges: selectedColleges.map(collegeId => ({ id: collegeId })) 
    };
  
    console.log("Selected Colleges before sending:", blogData); // Move this outside fetch
    
    fetch(`${config.API_URL}/api/blogs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Error: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        alert("Blog added successfully!");
        setTitle("");
        setDescription("");
        setSelectedColleges([]);  // Clear selected colleges
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding blog:", error);
        alert(`Failed to add blog. ${error.message}`);
      });
  };
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded mt-1"
            placeholder="Enter blog title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded mt-1"
            rows="4"
            placeholder="Enter blog description"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Colleges</label>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded mt-2"
          >
            Select Colleges
          </button>
          <div className="mt-3">
            {selectedColleges.map((collegeId) => (
              <span
                key={collegeId}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-2"
              >
                {colleges.find((c) => c.id === collegeId)?.name || "Unknown"}
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-3 rounded mt-4"
        >
          Add Blog
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/2">
            <h3 className="text-xl font-semibold mb-4">Select Colleges</h3>
            {loading ? (
              <p>Loading colleges...</p>
            ) : (
              <ul className="max-h-60 overflow-y-auto border rounded-lg p-3">
                {colleges.length > 0 ? (
                  colleges.map((college) => (
                    <li key={college.id} className="mb-2 flex items-center">
                      <input
                        type="checkbox"
                        id={`college-${college.id}`}
                        checked={selectedColleges.includes(college.id)}
                        onChange={() => handleCollegeSelection(college.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`college-${college.id}`} className="text-sm">
                        {college.name}
                      </label>
                    </li>
                  ))
                ) : (
                  <p>No colleges available.</p>
                )}
              </ul>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBlog;
