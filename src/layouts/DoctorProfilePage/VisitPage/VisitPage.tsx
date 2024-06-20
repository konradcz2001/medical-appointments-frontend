import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../security/AuthContext';
import { TypeOfVisit } from '../../../models/TypeOfVisit';
import { ScheduleComponent } from '../components/ScheduleComponent';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Leave } from '../../../models/Leave';
import { Pagination } from '../../Utils/Pagination';

/**
 * Functional component for the VisitPage.
 * Handles booking appointments, displaying leave calendar, and doctor leaves.
 */
export const VisitPage = () => {
    const location = useLocation();
    const { typesOfVisits, schedule } = location.state || {};
    
    const [dateTime, setDateTime] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedType, setSelectedType] = useState(typesOfVisits[0]?.id || null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [emptyPageError, setEmptyPageError] = useState<boolean>(false);
    const [totalAmountOfLeaves, setTotalAmountOfLeaves] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const leavesPerPage = 4;

    const doctorId = parseInt((window.location.pathname).split('/')[2], 10);
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchLeaves = async () => {
            setHttpError(null);
            setEmptyPageError(false);

            const response = await fetch(`${process.env.REACT_APP_API}doctors/${doctorId}/leaves?page=${currentPage - 1}&size=${leavesPerPage}&sort=startDate`);
            if (response.ok) {
                const responseJson = await response.json();
                const responseData = responseJson.content;
                const loadedLeaves: Leave[] = [];

                setTotalAmountOfLeaves(responseJson.totalElements);
                setTotalPages(responseJson.totalPages);

                for (const key in responseData) {
                    const loadedLeave: Leave = {
                        startDate: new Date(responseData[key].startDate),
                        endDate: new Date(responseData[key].endDate),
                        id: responseData[key].id
                    };
                    loadedLeaves.push(loadedLeave);
                }

                setLeaves(loadedLeaves);
            } else {
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }
        };

        fetchLeaves().catch((error: any) => {
            setIsLoading(false);
            if (error.message === "Page is empty") {
                setEmptyPageError(true);
            } else {
                setHttpError(error.message || "Something went wrong");
            }
        });
    }, [currentPage, doctorId, leavesPerPage]);

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
            const response = await fetch(`${process.env.REACT_APP_API}visits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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

    const isDateInRange = (date: Date, start: Date, end: Date) => {
        const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startWithoutTime = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endWithoutTime = new Date(end.getFullYear(), end.getMonth(), end.getDate());

        return dateWithoutTime >= startWithoutTime && dateWithoutTime <= endWithoutTime;
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

            {schedule && <ScheduleComponent schedule={schedule} />}

            <div className='row'><h3 className='col-md-6 text-center mt-3'>Leave Calendar</h3></div>
            <div className="row mt-3">
                <div className="col-md-6 d-flex justify-content-center mb-5">
                    <Calendar
                        tileClassName={({ date, view }) =>
                            view === 'month' && leaves.some(leave => isDateInRange(date, leave.startDate, leave.endDate)) ? 'date-in-range' : null
                        }
                    />
                </div>
                <div className="col-md-6 text-center">
                    <h4>Doctor Leaves</h4>
                    {emptyPageError ? (
                        <p className="text-center">There are no doctor leaves</p>
                    ) : (
                        <div>
                            <p className="text-center">
                                {currentPage * leavesPerPage - leavesPerPage + 1} to {Math.min(currentPage * leavesPerPage, totalAmountOfLeaves)} of {totalAmountOfLeaves} items:
                            </p>
                            {leaves.map(leave => (
                                <div key={leave.id} className="mt-3 text-center">
                                    <span>
                                        {leave.startDate.toLocaleString().substring(0, leave.startDate.toLocaleString().length - 3)} - {leave.endDate.toLocaleString().substring(0, leave.endDate.toLocaleString().length - 3)}{' '}
                                    </span>
                                </div>
                            ))}
                            <div className='d-flex justify-content-center mt-3 mb-5'>
                                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
                            </div>
                        </div>
                    )}
                    {httpError && <p className="text-danger text-center mt-3">{httpError}</p>}
                    {success && <p className="text-center mt-3">{success}</p>}
                </div>
            </div>
        </div>
    );
};
