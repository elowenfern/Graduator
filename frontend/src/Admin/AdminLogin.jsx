import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const onSubmit = async (data) => {
    try {
      // Send login credentials to backend
      const response = await axios.post(`${baseURL}/api/login/`,{
        email: data.email,
        password: data.password
      });
      console.log(response.data)
      // Save the tokens to localStorage
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // Redirect to dashboard on successful login
      navigate("/dashboard");
    } catch (err) {
      // Set error message if login fails
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input 
              type="text" 
              {...register('email', { required: 'email is required' })} 
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500" 
              placeholder="Enter your username"
            />
            {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input 
              type="password" 
              {...register('password', { required: 'Password is required' })} 
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500" 
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
