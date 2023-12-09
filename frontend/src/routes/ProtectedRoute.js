import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, existingUser } = useContext(AuthContext);

  const isAuthenticated = token && existingUser;
  const isAdmin = existingUser && existingUser.isAdmin; 

  const isAllowed = isAuthenticated && (
    (isAdmin && allowedRoles.includes('admin')) ||
    (!isAdmin && allowedRoles.includes('user'))
  );

  const accessibleRoute = isAllowed ? children : <Navigate to="/login" replace={true} />;

  return accessibleRoute;
};

export default ProtectedRoute;

