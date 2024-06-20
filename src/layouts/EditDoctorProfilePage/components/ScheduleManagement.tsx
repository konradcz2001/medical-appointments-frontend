import React, { useState, useEffect } from "react";
import { Schedule } from "../../../models/Schedule";
import { useAuth } from "../../../security/AuthContext";

/**
 * Functional component for managing a doctor's work schedule.
 * Handles state for schedule, loading status, HTTP errors, and success messages.
 * Utilizes useEffect to update schedule based on props, and handles input change and save actions.
 * Displays a table for each day of the week with start and end time inputs, and a button to save changes.
 */
export const ScheduleManagement = (props: any) => {
    const [schedule, setSchedule] = useState<Schedule>(new Schedule());
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        if (props.schedule) {
            setSchedule(props.schedule);
        }
    }, [props.schedule]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSchedule((prevSchedule) => ({
            ...prevSchedule,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setHttpError(null);
        setSuccess(null);

        try {
            const response = await fetch(`http://localhost:8080/doctors/${props.doctorId}/schedule`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(schedule),
            });

            if (!response.ok) {
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }

            setIsLoading(false);
            setSuccess("Schedule updated successfully");
        } catch (error: any) {
            setIsLoading(false);
            setHttpError(error.message || 'Something went wrong');
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h3>Work Schedule</h3>
            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                    </tr>
                </thead>
                <tbody>
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                        <tr key={day}>
                            <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                            <td>
                                <input
                                    type="time"
                                    name={`${day}Start`}
                                    value={(schedule as any)[`${day}Start`] ?? ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </td>
                            <td>
                                <input
                                    type="time"
                                    name={`${day}End`}
                                    value={(schedule as any)[`${day}End`] ?? ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSave} className="btn my-btn mt-3" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Schedule'} <i className="bi bi-floppy"></i>
            </button>
            {httpError && <p className="text-danger">{httpError}</p>}
            {success && <p className="text-success">{success}</p>}
        </div>
    );
};
