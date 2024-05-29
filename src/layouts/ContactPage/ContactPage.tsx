import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SpinnerLoading } from '../Utils/SpinnerLoading';

export const ContactPage = (props: any) => {
  const [subject, setSubject] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!props.isLoggedIn) {
      window.location.replace('/home');
    }
  }, [props.isLoggedIn]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8080/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: props.email, subject, body }), 
      });

      if (!response.ok) {
        setLoading(false);
        const errorData: any = await response.json();
        throw new Error(errorData.message);
      }

      setLoading(false);

      console.log("Message sent successfully");
      setSubject('');
      setBody('');
      setError('');
      setSuccess("Message sent successfully");
      //window.location.replace('/home');

    } catch (error: any) {
      setLoading(false);
      setError(error.message || 'Something went wrong');
    }
  };

  if (isLoading) {
    return (
      <>
        <div className='d-flex justify-content-center m-4'>Please wait, this may take a while</div>
        <SpinnerLoading />
      </>
    )
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="border p-4 bg-light">
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">Subject:</label>
              <input type="text" id="subject" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={100}/>
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message:</label>
              <textarea id="message" className="form-control" value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={1000}></textarea>
            </div>
            <button type="submit" className="btn my-btn me-3">
              Send <i className="bi bi-send"></i>
            </button>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text">{success}</p>}
          </form>
          <div className='m-4'>
                <Link type='button' className='btn my-btn'
                    to={`/home`}>
                    Return to home page
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};
