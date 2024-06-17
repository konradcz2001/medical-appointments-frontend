import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../security/AuthContext';
import { TypeOfVisit } from '../../../models/TypeOfVisit';

export const VisitPage = () => {
    const location = useLocation();
    const { typesOfVisits } = location.state || {};

    const [dateTime, setDateTime] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedType, setSelectedType] = useState(typesOfVisits[0]?.id || null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    const doctorId = parseInt((window.location.pathname).split('/')[2], 10);
    const { user } = useAuth();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError(null);

        const selectedTypeId = parseInt(selectedType, 10);

        const type: TypeOfVisit | undefined = typesOfVisits.find((type: any) => type.id === selectedTypeId);

        if (!type) {
            setError('Selected type of visit not found');
            return;
        }

        const visitData = {
            date: new Date(dateTime),
            notes,
            typeOfVisit: { ...type, doctorId },
            clientId: user?.id
        };

        try {
            const response = await fetch(`http://localhost:8080/visits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            console.log("Appointment booked successfully");
            setSuccess("Appointment booked successfully");
        } catch (error: any) {
            setError(error.message || 'Something went wrong');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Make an appointment</h2>
            <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                <div className="form-group mt-4 w-50">
                    <label htmlFor="datetime">Date and Time:</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        id="datetime"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mt-4 w-50">
                    <label htmlFor="notes">Notes (optional):</label>
                    <textarea
                        className="form-control"
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-group mt-4 w-50">
                    <label htmlFor="type">Type of Visit:</label>
                    <select
                        className="form-control"
                        id="type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        required
                    >
                        {typesOfVisits.map((type: any) => (
                            <option key={type.id} value={type.id}>
                                {type.type} ({type.duration} minutes) - {type.price}{type.currency}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn my-btn mt-5 w-50">
                    Book Appointment <i className="bi bi-journal-bookmark"></i>
                </button>
                {error && <p className="text-danger mt-3">{error}</p>}
                {success && <p className="text">{success}</p>}
            </form>
            <Link type='button' className='btn my-btn mt-5 mb-5 text-center' to={`/doctor/${doctorId}`}>
                Back to doctor's profile <i className="bi bi-arrow-return-left"></i>
            </Link>
        </div>
    );
};
