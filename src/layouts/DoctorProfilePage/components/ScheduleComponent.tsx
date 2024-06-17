import { Schedule } from "../../../models/Schedule";


export const ScheduleComponent = (props: any) => {
    const schedule = props.schedule || new Schedule();

    const formatTime = (time?: string) => {
        if (!time) return 'N/A';
        const [hour, minute] = time.split(':');
        const hourNumber = parseInt(hour, 10);
        const minuteNumber = parseInt(minute, 10);

        if (isNaN(hourNumber) || isNaN(minuteNumber)) return 'N/A';

        const period = hourNumber >= 12 ? 'PM' : 'AM';
        const formattedHour = hourNumber % 12 || 12;

        return `${formattedHour}:${minute.padStart(2, '0')} ${period}`;
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