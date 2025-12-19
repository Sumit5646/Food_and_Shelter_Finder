import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element }) {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userData = JSON.parse(user);
  
  if (userData.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return element;
}

export default ProtectedRoute;
