import React from "react";
import { Link } from "react-router-dom";

/**
 * Functional component that renders a welcome message for booking a medical appointment.
 * Includes a heading, description, and a button to search for doctors.
 */
export const Welcome = () => {
    return (
        <div className='p-5 mb-4 bg-dark header'>
            <div className='container-fluid py-5 text-white 
                d-flex justify-content-center align-items-center'>
                <div>
                    <h1 className='display-5 fw-bold'>Book your medical appointment</h1>
                    <p className='col-md-8 fs-4'>Find the right specialist for your needs</p>
                    <Link type='button' className='btn main-color btn-lg text-white' to='/search'>
                        Search Doctors <i className="bi bi-search"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}