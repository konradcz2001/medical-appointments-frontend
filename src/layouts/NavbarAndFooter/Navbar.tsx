import React, { useState, useEffect } from 'react';
import { Link, NavLink, useHistory } from "react-router-dom";

export const Navbar = (props: any) => {
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    props.setIsLoggedIn(false);
    //history.push('/home');
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
            {props.isLoggedIn ? (
              <>
                <li className='nav-item m-1'>
                    <Link type='button' className='btn btn-outline-light' to='/profile'>
                      <i className="bi bi-gear"></i>
                    </Link>
                </li>
                <li className='nav-item m-1'>
                    <button type='button' className='btn btn-outline-light' onClick={handleLogout}>
                      Log Out <i className="bi bi-box-arrow-left"></i>
                    </button>
                </li>
              </>
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
