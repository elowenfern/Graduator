// src/components/ContactInformation.js
import React from 'react';

const Contact= () => (
  <section className="p-10 bg-gray-100 text-gray-900">
    <h2 className="text-3xl font-bold text-center">Contact Us</h2>
    <form className="max-w-lg mx-auto mt-8">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="name">Name</label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          id="name"
          placeholder="Your Name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="email"
          id="email"
          placeholder="Your Email"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="message">Message</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          id="message"
          placeholder="Your Message"
        ></textarea>
      </div>
      <button className="w-full p-3 bg-green-500 text-white font-bold rounded hover:bg-green-700">
        Send Message
      </button>
    </form>
  </section>
);

export default Contact
