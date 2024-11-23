import React, { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [messageColor, setMessageColor] = useState("black");
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!name || !email || !phone || !message) {
      setResponseMessage("Please fill out all the fields.");
      setMessageColor("red");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setResponseMessage("Please enter a valid email address.");
      setMessageColor("red");
      return;
    }

    // Phone number validation (assuming country code and 10-digit number)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setResponseMessage("Please enter a valid phone number with 10 digit.");
      setMessageColor("red");
      return;
    }

    const formData = { name, email, phone, message };

    try {
      const response = await fetch(`${baseURL}/api/send-whatsapp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setResponseMessage(data.message);
        setMessageColor("green");
      } else {
        setResponseMessage(data.error);
        setMessageColor("red");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setResponseMessage("An error occurred while sending your message.");
      setMessageColor("red");
    }
  };

  return (
    <section className="p-10 bg-gray-100 text-gray-900">
      <h2 className="text-3xl font-bold text-center">Contact Us</h2>
      <form className="max-w-lg mx-auto mt-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">Name</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            id="name"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            id="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="phone">Phone</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            id="phone"
            placeholder="Enter 10 digit number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="message">Message</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            id="message"
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button className="w-full p-3 bg-green-500 text-white font-bold rounded hover:bg-green-700">
          Send Message
        </button>
      </form>
      <p style={{ color: messageColor, marginTop: '10px' }}>{responseMessage}</p>
    </section>
  );
};

export default Contact;
