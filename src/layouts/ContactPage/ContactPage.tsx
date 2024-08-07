import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { useAuth } from '../../security/AuthContext';

/**
 * Functional component ContactPage that handles sending an email message.
 * Manages form state, submission, loading state, errors, and success messages.
 * Utilizes useState and useEffect hooks for state management.
 * Uses fetch API to send email data to the server.
 * Displays loading spinner while waiting for the response.
 * Renders a form with subject and message inputs, error and success messages, and a link to return to the home page.
 */

export const ContactPage = () => {
  const [subject, setSubject] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, token } = useAuth();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuccess(null);


    try {
      const response = await fetch(`${process.env.REACT_APP_API}email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userEmail: user?.sub, subject, body }), 
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
                    Back to home page <i className="bi bi-arrow-return-left"></i>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};
