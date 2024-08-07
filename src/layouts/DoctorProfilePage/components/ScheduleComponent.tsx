import { Schedule } from "../../../models/Schedule";

/**
 * Functional component that renders a schedule table based on the provided props.
 * It uses a Schedule model to populate the table with start and end times for each day of the week.
 * If no schedule is provided in props, it creates a new Schedule instance.
 * The formatTime function is used to format the time values before displaying them in the table.
 */
export const ScheduleComponent = (props: any) => {
    const schedule = props.schedule || new Schedule();

    const formatTime = (time?: string) => {
        if (!time) return 'N/A';
        const [hour, minute] = time.split(':');
        const hourNumber = parseInt(hour, 10);
        const minuteNumber = parseInt(minute, 10);

        if (isNaN(hourNumber) || isNaN(minuteNumber)) return 'N/A';

        return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    };

    return (
        <div className="container mb-5">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Monday</td>
                        <td>{formatTime(schedule.mondayStart)}</td>
                        <td>{formatTime(schedule.mondayEnd)}</td>
                    </tr>
                    <tr>
                        <td>Tuesday</td>
                        <td>{formatTime(schedule.tuesdayStart)}</td>
                        <td>{formatTime(schedule.tuesdayEnd)}</td>
                    </tr>
                    <tr>
                        <td>Wednesday</td>
                        <td>{formatTime(schedule.wednesdayStart)}</td>
                        <td>{formatTime(schedule.wednesdayEnd)}</td>
                    </tr>
                    <tr>
                        <td>Thursday</td>
                        <td>{formatTime(schedule.thursdayStart)}</td>
                        <td>{formatTime(schedule.thursdayEnd)}</td>
                    </tr>
                    <tr>
                        <td>Friday</td>
                        <td>{formatTime(schedule.fridayStart)}</td>
                        <td>{formatTime(schedule.fridayEnd)}</td>
                    </tr>
                    <tr>
                        <td>Saturday</td>
                        <td>{formatTime(schedule.saturdayStart)}</td>
                        <td>{formatTime(schedule.saturdayEnd)}</td>
                    </tr>
                    <tr>
                        <td>Sunday</td>
                        <td>{formatTime(schedule.sundayStart)}</td>
                        <td>{formatTime(schedule.sundayEnd)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
