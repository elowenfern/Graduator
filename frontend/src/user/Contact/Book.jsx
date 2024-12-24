import React, { useState } from "react";
import axios from 'axios';  // Import axios
import config from "../../config";

const Book = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [college, setCollege] = useState("");
  const [message, setMessage] = useState(""); 
  const [messageColor, setMessageColor] = useState("black"); 
  const baseURL = config.API_URL;

  // New sendInquiry function using axios
  const sendInquiry = async (inquiryData) => {
    try {
      const response = await axios.post(`${baseURL}/api/send-whatsapp/`, inquiryData);
      setMessage(response.data.message);
      setMessageColor("green");

      // Reset form on success
      setName("");
      setEmail("");
      setPhone("");
      setCourse("");
      setCollege("");
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Unexpected error occurred.");
      }
      setMessageColor("red");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !course || !college) {
      setMessage("Please fill out all the fields.");
      setMessageColor("red");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageColor("red");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setMessage("Please enter a valid 10-digit phone number.");
      setMessageColor("red");
      return;
    }

    const formData = {
      name,
      email,
      phone,
      course,
      college,
    };

    // Call sendInquiry instead of fetch
    await sendInquiry(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        BOOK ADMISSION
      </h2>

      <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm"
            />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Phone (XXXXXXXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm"
            />
            <input
              type="text"
              placeholder="Course Name"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          <input
            type="text"
            placeholder="College Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
          />

          <button
            type="submit"
            className="w-full p-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
          >
            Submit
          </button>
        </form>

        <div
          style={{ color: messageColor, marginTop: "15px" }}
          className="text-center text-lg"
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default Book;
