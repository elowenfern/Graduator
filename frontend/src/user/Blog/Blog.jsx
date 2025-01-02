import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import BookAdmissionForm from '../Contact/Sidebook';
import TopColleges from '../Colleges/Topcolleges';
import PopularCoursesSection from '../Colleges/PopularCourse';


// Blog List Component
function BlogList({ onSelect }) {
    const [blogs, setBlogs] = useState([]);
  
    useEffect(() => {
      axios.get(`${config.API_URL}/api/blogs`)
        .then(response => setBlogs(response.data))
        .catch(error => console.error('Error fetching blogs:', error));
    }, []);
  
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 drop-shadow-md">
            Discover Our Latest Blogs
          </h1>
          <p className="text-gray-600 mt-2">Stay updated with the latest trends and insights.</p>
        </div>
  
        <ul className="bg-white rounded-lg shadow overflow-hidden">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="p-4 border-b cursor-pointer hover:bg-blue-50 transition duration-200"
              onClick={() => onSelect(blog)}
            >
              <div
                className="text-lg font-semibold hover:text-blue-600 hover:underline transition-transform transform hover:scale-105"
              >
                {blog.title}
              </div>
              <p className="text-sm text-gray-500">Click to read more...</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  


  
// Blog Details Component
function BlogDetails({ blog, onBack }) {
    const [colleges, setColleges] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      console.log('Blog Colleges:', blog.colleges);
      if (blog.colleges && blog.colleges.length > 0) {
        axios.get(`${config.API_URL}/api/colleges?blog_id=${blog.id}`)
          .then(response => {
            console.log('API Response:', response.data);
            setColleges(response.data);
          })
          .catch(error => console.error('Error fetching colleges:', error));
      }
    }, [blog]);
  
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={onBack} 
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Blogs
        </button>
  
        {/* Blog Title */}
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">{blog.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">{blog.description}</p>
  
        {/* Colleges Section */}
        <h2 className="text-3xl font-semibold mb-6 text-blue-700">Colleges Offering This Course</h2>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges && colleges.length > 0 ? (
            colleges.slice(0, 9).map((college) => (
              <div 
                key={college.id} 
                className="group border rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate(`/colleges/${college.slug}`)}
              >
                <div className="relative">
                  <img 
                    src={`${config.API_URL}${college.images[0]?.image}` || '/placeholder.jpg'} 
                    alt={college.name} 
                    className="w-full h-48 object-cover group-hover:blur-sm transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-xl font-semibold">View Details</p>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 
                    className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-all duration-300"
                  >
                    {college.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">Click to learn more about this college.</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">No colleges available for this blog.</p>
          )}
        </div>
      </div>
    );
  }

  


// Main Component
export default function BlogPage() {
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
      
      {/* Left Section: Blog List or Details */}
      <div className="w-full lg:w-[70%]">
        {selectedBlog ? (
          <BlogDetails blog={selectedBlog} onBack={() => setSelectedBlog(null)} />
        ) : (
          <BlogList onSelect={(blog) => setSelectedBlog(blog)} />
        )}
      </div>

      {/* Right Section: Book Admission & Popular Courses */}
      <div className="flex flex-col gap-6 bg-white shadow-md p-4 rounded-lg w-full lg:w-[30%]">
        <div className="w-full bg-gray-50 p-4 rounded-md shadow-sm">
          <BookAdmissionForm />
        </div>

        <div className="w-full bg-gray-50 p-4 rounded-md shadow-sm">
          <TopColleges />
        </div>

        <div className="w-full bg-gray-50 p-4 rounded-md shadow-sm">
          <PopularCoursesSection />
        </div>
      </div>
    </div>
  );
}
