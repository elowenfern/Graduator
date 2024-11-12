import React, { useState, useEffect } from 'react';

const FilteredColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  
  useEffect(() => {
    const fetchColleges = async () => {
      let url = '/api/colleges/';  // Base API URL

      // Add query parameters if category or course is selected
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }
      if (selectedCourse) {
        url += `?course=${selectedCourse}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setColleges(data);  // Set the colleges state with fetched data
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, [selectedCategory, selectedCourse]);  // Re-fetch when category or course changes

  return (
    <div>
      <h1>Filtered Colleges</h1>

      {/* Category filter */}
      <select
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        <option value="">Select Category</option>
        <option value="paramedical">Paramedical</option>
        <option value="medical">Medical</option>
        <option value="engineering">Engineering</option>
        {/* Add other categories as needed */}
      </select>

      {/* Course filter */}
      <select
        onChange={(e) => setSelectedCourse(e.target.value)}
        value={selectedCourse}
      >
        <option value="">Select Course</option>
        <option value="B.Sc Medical Laboratory Tech">B.Sc Medical Laboratory Tech</option>
        <option value="M.Sc Anaesthesia">M.Sc Anaesthesia</option>
        {/* Add other course options as needed */}
      </select>

      {/* Display filtered colleges */}
      <div className="college-list">
        {colleges.length > 0 ? (
          colleges.map((college) => (
            <div key={college.id} className="college-card">
              <h3>{college.name}</h3>
              <p>{college.location}</p>
              {/* Add other college details as needed */}
            </div>
          ))
        ) : (
          <p>No colleges found for the selected criteria.</p>
        )}
      </div>
    </div>
  );
};

export default FilteredColleges;
