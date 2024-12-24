import React, { useState } from 'react';
import config from '../../config';

const BookAdmissionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    college: '',
  });

  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.phone || !formData.course || !formData.college) {
      setMessage({ text: 'All fields are required', type: 'error' });
      return;
    }
    
    try {
      const response = await fetch(`${config.API_URL}/api/send-whatsapp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage({ text: 'Admission booked successfully!', type: 'success' });
        setFormData({ name: '', email: '', phone: '', course: '', college: '' }); // Clear form on success
      } else {
        const data = await response.json();
        setMessage({ text: data.error || 'An error occurred while submitting the form', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to send data', type: 'error' });
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Book Your Admission</h2>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your 10-digit phone number"
            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Course */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Course name</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="Enter the course name"
            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* College */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">College Name</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="Enter the college name"
            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {message.text}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-5 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
        >
          Submit Admission
        </button>
      </form>
    </div>
  );
};

export default BookAdmissionForm;
