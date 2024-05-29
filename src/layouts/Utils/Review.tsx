import { useEffect, useState } from "react";
import ReviewModel from "../../models/ReviewModel";
import { StarsReview } from "./StarsReview";
import { SpinnerLoading } from "./SpinnerLoading";

export const Review: React.FC<{ review: ReviewModel }> = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [clientName, setClientName] = useState('');

    useEffect(() => {
        const fetchClientName = async () => {

            const reviewUrl: string = `http://localhost:8080/clients/${props.review.client_id}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews.firstName;

            setClientName(responseData);
            setIsLoading(false);
        };
        fetchClientName().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })


    }, [props.review]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }
    
    const date = new Date(props.review.date);

    const longMonth = date.toLocaleString('en-us', { month: 'long' });
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();

    const dateRender = longMonth + ' ' + dateDay + ', ' + dateYear;
    
    return (
        <div>
            <div className='col-sm-8 col-md-8'>
                <div className="d-flex align-items-center">
                <div>
                    <StarsReview rating={props.review.rating} size={20} />
                </div>
                <div className='ms-2 mt-1'>
                    <h5>{clientName}</h5>
                </div>
                </div>
                    <div className='row'>
                    <div className='col'>
                    {dateRender}
                </div>
                </div>
                    <div className='mt-2'>
                    <p>
                        {props.review.description}
                    </p>
                </div>
            </div>
            <hr/>
        </div>


    );
}