// ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {

  const isAuthenticated = !!localStorage.getItem("access_token");
  console.log("Is Authenticated:", isAuthenticated); 

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin" />;
};

export default ProtectedRoute;
