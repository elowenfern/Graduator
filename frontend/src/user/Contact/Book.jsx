// Book.js
import React, { useState } from 'react';

const Book = () => {
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    college: '',
    contactNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.college) newErrors.college = 'College is required';
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      sendWhatsAppMessage();
    }
  };

  const sendWhatsAppMessage = () => {
    const message = `New Admission Query:
    Name: ${formData.name}
    Course: ${formData.course}
    College: ${formData.college}
    Contact Number: ${formData.contactNumber}
    Email: ${formData.email}`;
    
    // Replace `yourAdminPhoneNumber` with the admin's WhatsApp number including country code
    window.open(`https://wa.me/yourAdminPhoneNumber?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800">Book Admission</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 p-2 rounded-lg"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-gray-700">Course</label>
          <input
            type="text"
            name="course"
            className="w-full border border-gray-300 p-2 rounded-lg"
            value={formData.course}
            onChange={handleChange}
          />
          {errors.course && <p className="text-red-500 text-sm">{errors.course}</p>}
        </div>
        <div>
          <label className="block text-gray-700">College</label>
          <input
            type="text"
            name="college"
            className="w-full border border-gray-300 p-2 rounded-lg"
            value={formData.college}
            onChange={handleChange}
          />
          {errors.college && <p className="text-red-500 text-sm">{errors.college}</p>}
        </div>
        <div>
          <label className="block text-gray-700">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            className="w-full border border-gray-300 p-2 rounded-lg"
            value={formData.contactNumber}
            onChange={handleChange}
          />
          {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 p-2 rounded-lg"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg mt-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Book;
