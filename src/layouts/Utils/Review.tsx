import ReviewModel from "../../models/ReviewModel";
import { StarsReview } from "./StarsReview";
import React from "react";

export const Review: React.FC<{ review: ReviewModel }> = (props) => {


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
                    <h5>{props.review.clientFirstName}</h5>
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