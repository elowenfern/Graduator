import React, { useState } from "react";

const GettoUS = () => {
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
    <div className="p-6 sm:p-10 bg-gray-100">
      <div className="bg-green-500 text-white rounded-lg p-6 sm:p-10 flex flex-col sm:flex-row justify-between">
        {/* Left Side - Information */}
        <div className="w-full sm:w-1/2 mb-6 sm:mb-0">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Did you Choose a College?</h2>
          <p className="mb-2">Did you find your desired College?</p>
          <p className="mb-2">Need more Assistance?</p>
          <p className="mb-6">Get customised counseling from our Experts now!</p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full sm:w-1/2">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Talk to our Experts</h2>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-1 p-3 rounded-lg bg-white text-gray-800 shadow-md"
            />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-1 p-3 rounded-lg bg-white text-gray-800 shadow-md"
            />
            <input
              type="text"
              placeholder="XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-1 p-3 rounded-lg bg-white text-gray-800 shadow-md"
            />
            <input
              type="text"
              placeholder="Interested Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="col-span-1 p-3 rounded-lg bg-white text-gray-800 shadow-md"
            />
            <input
              type="text"
              placeholder="Enter College"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="col-span-2 p-3 rounded-lg bg-white text-gray-800 shadow-md"
            />
            <button className="col-span-2 p-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-green-100">
              Submit
            </button>
          </form>

          {/* Message display area */}
          <div id="messageBox" style={{ color: messageColor, marginTop: "10px" }}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettoUS;

