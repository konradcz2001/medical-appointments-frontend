import React from 'react';
import { Link, NavLink } from "react-router-dom";
import { useAuth } from '../../security/AuthContext';

/**
 * Functional component for rendering a navigation bar with dynamic content based on user authentication status and role.
 * Utilizes React Router for navigation and AuthContext for user authentication.
 * Handles user logout functionality and redirects to the home page upon logout.
 */
export const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.replace("/home");
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
      <div className='container-fluid'>
        <Link className="nav-link" to="/home"><span className='navbar-brand'>Medical Appointments</span></Link>
        <button className='navbar-toggler' type='button'
          data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
          aria-controls='navbarNavDropdown' aria-expanded='false'
          aria-label='Toggle Navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNavDropdown'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/home'>Home</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/search'>Search Doctors</NavLink>
            </li>
          </ul>
          <ul className='navbar-nav ms-auto'>
            
              {user && user?.role !== 'DOCTOR' && 
                <li className='nav-item m-1'>
                    <Link type='button' className='btn btn-outline-light' to='/client-profile'>
                      <i className="bi bi-gear"></i>
                    </Link>
                </li>
              }
              {user && user?.role === 'DOCTOR' &&
                <li className='nav-item m-1'>
                    <Link type='button' className='btn btn-outline-light' to='/doctor-profile'>
                      <i className="bi bi-gear"></i>
                    </Link>
                </li>
              }

            {user ? (
                <li className='nav-item m-1'>
                    <button type='button' className='btn btn-outline-light' onClick={handleLogout}>
                      Log Out <i className="bi bi-box-arrow-left"></i>
                    </button>
                </li>
              
            ) : (
              <li className='nav-item m-1'>
                <Link type='button' className='btn btn-outline-light' to='/login'>
                  Sign In <i className="bi bi-box-arrow-in-right"></i>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
