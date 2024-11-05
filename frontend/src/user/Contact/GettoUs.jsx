import React from "react";

const GettoUS = () => {
  return (
    <div className="p-10 bg-gray-100">
      <div className="bg-green-500 text-white rounded-lg p-10 flex justify-between">
        {/* Left Side - Information */}
        <div className="w-1/2">
          <h2 className="text-3xl font-semibold mb-4">Did you Choose a College?</h2>
          <p className="mb-2">Did you find your desired College?</p>
          <p className="mb-2">Need more Assistance?</p>
          <p className="mb-6">Get customised counseling from our Experts now!</p>
          {/* Optional image or illustration */}
          <div className="hidden md:block">
            {/* Add image or illustration here if needed */}
            {/* <img
              src="https://via.placeholder.com/150"
              alt="Let's Chat Illustration"
              className="w-32"
            /> */}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">Talk to our Experts</h2>
          <form className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Enter Name"
              className="col-span-1 p-3 rounded-lg bg-white text-gray-800 shadow-md"
            />
            <input
              type="email"
              placeholder="Enter Email"
              className="col-span-1 p-3 rounded-lg bg-white text-gray-800 shadow-md"
            />
            <input
              type="text"
              placeholder="+91"
              className="col-span-1 p-3 rounded-lg bg-white text-gray-800 shadow-md"
            />
            <input
              type="text"
              placeholder="Interested Course"
              className="col-span-1 p-3 rounded-lg bg-white text-gray-800 shadow-md"
            />
            <input
              type="text"
              placeholder="Enter College"
              className="col-span-2 p-3 rounded-lg bg-white text-gray-800 shadow-md"
            />
            <button className="col-span-2 p-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-green-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GettoUS;