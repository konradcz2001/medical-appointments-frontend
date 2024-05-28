// RegistrationForm.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const RegisterPage = (props: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('CLIENT'); // Domyślnie wybierany jest klient
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (props.isLoggedIn) {
      window.location.replace('/home');
    }
  }, [props.isLoggedIn]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Tutaj dodaj logikę wysłania żądania rejestracji do backendu
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });

      if (!response.ok) {
        const errorData: any = await response.json();
        throw new Error(errorData.message);
      }

      console.log('Registration successful');
      window.location.replace("/login");
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form className="border p-4 bg-light" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name:</label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name:</label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Register as:</label>
              <select
                id="role"
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="CLIENT">Client</option>
                <option value="DOCTOR">Doctor</option>
              </select>
            </div>
            <button type="submit" className="btn my-btn me-3">
              Register <i className="bi bi-person-plus"></i>
            </button>
            <Link type='button' className='btn my-btn' to='/login'>
              Sign In <i className="bi bi-box-arrow-in-right"></i>
            </Link>
            {error && <p className="mt-3" style={{ color: 'red' }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};
