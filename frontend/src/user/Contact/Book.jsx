import React, { useState } from "react";

const Book = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [college, setCollege] = useState("");
  const [message, setMessage] = useState(""); // State for message
  const [messageColor, setMessageColor] = useState("black"); // State for message color
  const baseURL = process.env.REACT_APP_API_URL;

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for fields
    if (!name || !email || !phone || !course || !college) {
      setMessage("Please fill out all the fields.");
      setMessageColor("red");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageColor("red");
      return;
    }

    // Phone number validation (assumes country code and 10-digit number for example, "+91" for India)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setMessage("Please enter a valid phone number in the 10 digit");
      setMessageColor("red");
      return;
    }

    // Prepare the data to send to the backend
    const formData = {
      name,
      email,
      phone,
      course,
      college,
    };

    // Send form data to the backend to trigger WhatsApp message to admin
    try {
      const response = await fetch(`${baseURL}/api/send-whatsapp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); // Set success message
        setMessageColor("green"); // Set color to green for success

        // Reset form fields after successful submission
        setName("");
        setEmail("");
        setPhone("");
        setCourse("");
        setCollege("");
      } else {
        setMessage(data.error); // Set error message
        setMessageColor("red"); // Set color to red for error
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage("An unexpected error occurred.");
      setMessageColor("red");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg">
      {/* Header Section */}
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        BOOK ADMISSION
      </h2>

      {/* Form Section */}
      <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Phone (XXXXXXXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Course Name"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <input
            type="text"
            placeholder="College Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            Submit
          </button>
        </form>

        {/* Message Section */}
        <div
          id="messageBox"
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
