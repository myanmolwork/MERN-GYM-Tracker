import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import {
  FaDumbbell,
  FaPlus,
  FaList,
  FaWeight,

  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa';
import '../AppNavbar.css';

const AppNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="custom-navbar" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-glow">
          <FaDumbbell className="me-2" />
          GYMTRAC
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  <FaDumbbell className="me-1" /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/add-workout">
                  <FaPlus className="me-1" /> Add Workout
                </Nav.Link>
                <Nav.Link as={Link} to="/workouts">
                  <FaList className="me-1" /> Workouts
                </Nav.Link>
                <Nav.Link as={Link} to="/log-weight">
                  <FaWeight className="me-1" /> Log Weight
                </Nav.Link>
             
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">
                  <FaUserPlus className="me-1" /> Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  <FaSignInAlt className="me-1" /> Login
                </Nav.Link>
              </>
            )}
          </Nav>

          {token && (
            <Button className="nav-btn" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
