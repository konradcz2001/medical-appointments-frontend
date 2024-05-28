import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const LoginPage = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (props.isLoggedIn) {
      window.location.replace('/home');
    }
  }, [props.isLoggedIn]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData: any = await response.json();
        throw new Error(errorData.message);
      }


      const data = await response.json();

      const jwt = data.token;

      if (jwt) {
        localStorage.setItem('jwt', jwt);
      } else {
        throw new Error('Token not found in the response');
      }

      console.log('Login successful');
      window.location.replace('/home');



    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="border p-4 bg-light">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn my-btn me-3">
              Log In <i className="bi bi-box-arrow-in-right"></i>
            </button>
            <Link type='button' className='btn my-btn' to='/register'>
              Sign Up <i className="bi bi-person-plus"></i>
            </Link>
            {error && <p className="text-danger">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};
