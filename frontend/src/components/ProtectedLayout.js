import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      {isAuthenticated && <Navbar />}
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
};

export default ProtectedLayout;
