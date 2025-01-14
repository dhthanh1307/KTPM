import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode; // Hoặc JSX.Element nếu bạn muốn
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = localStorage.getItem('accessToken'); 
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{element}</>; 
};

export default PrivateRoute;
