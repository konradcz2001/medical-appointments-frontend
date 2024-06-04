import { Leave } from "../../../models/Leave";
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import DateTimePicker from 'react-datetime-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import { Pagination } from '../../Utils/Pagination';

export const LeavesManagement = (props: any) => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [emptyPageError, setEmptyPageError] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [leavesPerPage] = useState(4);
    const [totalAmountOfLeaves, setTotalAmountOfLeaves] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchLeaves = async () => {
            setHttpError(null);
            setEmptyPageError(false);
            
            const response = await fetch(`http://localhost:8080/doctors/${props.doctorId}/leaves?page=${currentPage - 1}&size=${leavesPerPage}&sort=startDate`);
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

    }, [currentPage, leavesPerPage, props.doctorId, success]);

    const handleAddLeave = async () => {
        setSuccess(null);
        setHttpError(null);
        if (!startDate || !endDate) return;

        const newLeave = { startDate, endDate };

        try {
            const response = await fetch(`http://localhost:8080/doctors/${props.doctorId}/add-leave`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newLeave),
            });

            if (response.ok) {
                console.log("udane");
                setStartDate(null);
                setEndDate(null);
                setSuccess("Leave added successfully");
            } else {
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error: any) {
            setHttpError(error.message || 'Something went wrong');
        }
    };

    const handleRemoveLeave = async (leaveId: number | undefined) => {
        setSuccess(null);
        setHttpError(null);
        if (!leaveId) return;

        try {
            const response = await fetch(`http://localhost:8080/doctors/${props.doctorId}/remove-leave?id=${leaveId}`, {
                method: 'PATCH',
            });

            if (response.ok) {
                setLeaves(leaves.filter(leave => leave.id !== leaveId));
                setSuccess("Leave removed successfully");
            } else {
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error: any) {
            setHttpError(error.message || 'Something went wrong');
        }
    };

    const isDateInRange = (date: Date, start: Date, end: Date) => {
        const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startWithoutTime = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endWithoutTime = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        
        return dateWithoutTime >= startWithoutTime && dateWithoutTime <= endWithoutTime;
    };
    

    const onDateClick = (date: Date) => {
        // Your code for handling date click
    };

    const indexOfLastLeave: number = currentPage * leavesPerPage;
    const indexOfFirstLeave: number = indexOfLastLeave - leavesPerPage;

    let lastItem = leavesPerPage * currentPage <= totalAmountOfLeaves ? 
            leavesPerPage * currentPage : totalAmountOfLeaves;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <>
            <div className='row'><h3 className='col-md-4 text-center mt-3'>Leave Calendar</h3></div>
            <div className="row mt-3">
                <div className="col-md-4 d-flex justify-content-center">
                    <Calendar
                        onClickDay={onDateClick}
                        tileClassName={({ date, view }) => 
                            view === 'month' && leaves.some(leave => isDateInRange(date, leave.startDate, leave.endDate)) ? 'date-in-range' : null
                        }
                    />
                </div>
                <div className="mt-3 col-md-4 text-center">
                    <h4>Add Leave</h4>
                    <div className="mt-3">
                        <DateTimePicker
                            onChange={setStartDate}
                            value={startDate}
                            format="y-MM-dd h:mm a"
                        />
                    </div>
                    <div className="mt-3">
                        <DateTimePicker
                            onChange={setEndDate}
                            value={endDate}
                            format="y-MM-dd h:mm a"
                        />
                    </div>
                    <button onClick={handleAddLeave} className="btn my-btn mt-3 mb-3">Add Leave</button>
                </div>
                <div className="col-md-4 text-center">
                    <h4>Remove Leave</h4>

                    {emptyPageError ? <p className="text">You have no visits yet</p> : 
                    <p>
                        {indexOfFirstLeave + 1} to {lastItem} of {totalAmountOfLeaves} items:
                    </p>}

                    {leaves.map((leave, index) => (
                        <div key={index} className="mt-3">
                            <span>{leave.startDate.toLocaleString().substring(0, leave.startDate.toLocaleString().length - 3)} - {leave.endDate.toLocaleString().substring(0, leave.endDate.toLocaleString().length - 3) + ' | '}</span>
                            <button onClick={() => handleRemoveLeave(leave.id)} className="btn btn-trash"> <i className="bi bi-trash3"></i></button>
                        </div>
                    ))}
                    <div className='d-flex justify-content-center mt-3'>
                        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
                    </div>
                </div>
                <div className='text-center mt-3'>
                    {httpError && <p className="text-danger">{httpError}</p>}
                    {success && <p className="text">{success}</p>}
                </div>
            </div>
        </>
    );
}
