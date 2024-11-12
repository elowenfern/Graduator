import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CoursesPage = () => {
  const { collegeId } = useParams(); // Get the college ID from the URL
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Start with page 1
  const [hasMore, setHasMore] = useState(true); // To check if there are more courses to load
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
        setHasMore(false); // No more courses to load
      } else {
        setCourses((prevCourses) => [...prevCourses, ...response.data]); // Append new courses
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
    // Check if we're at the bottom of the page
    if (
      e.target.documentElement.scrollHeight === e.target.documentElement.scrollTop + window.innerHeight &&
      hasMore && !loading
    ) {
      setPage((prevPage) => prevPage + 1); // Load the next page
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

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
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                    onClick={() => { /* Edit logic */ }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => { /* Delete logic */ }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-2 px-4 text-center">No courses found</td>
            </tr>
          )}
        </tbody>
      </table>

      {loading && <div>Loading more courses...</div>}
    </div>
  );
};

export default CoursesPage;
