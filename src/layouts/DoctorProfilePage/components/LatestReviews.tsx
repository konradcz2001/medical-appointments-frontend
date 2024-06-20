import { Link } from "react-router-dom";
import React from "react";
import ReviewModel from "../../../models/ReviewModel";
import { Review } from "../../Utils/Review";


/**
 * Functional component that displays the latest reviews for a doctor.
 * 
 * @param reviews Array of ReviewModel objects representing the reviews to display
 * @param doctorId The ID of the doctor for whom the reviews are being displayed
 * @param mobile Boolean indicating if the component is being viewed on a mobile device
 * @returns JSX element displaying the latest reviews and an option to view all reviews
 */
export const LatestReviews: React.FC<{
    reviews: ReviewModel[], doctorId: number | undefined, mobile: boolean
}> = (props) => {

    return (
        <div className={props.mobile ? 'mt-3' : 'row mt-5'}>
            <div className={props.mobile ? '' : 'col-sm-2 col-md-2 mb-4'}>
                <h2>Latest Reviews: </h2>
            </div>
            <div className='col-sm-10 col-md-10'>
                {props.reviews.length > 0 ?
                    <>
                        {props.reviews.slice(0, 3).map(eachReview => (
                            <Review review={eachReview} key={eachReview.id}></Review>
                        ))}

                        <div className='m-4'>
                            <Link type='button' className='btn my-btn'
                                to={`/review-list/${props.doctorId}`}>
                                Show all reviews <i className="bi bi-list-stars"></i>
                            </Link>
                        </div>
                    </>
                    :
                    <div className='m-3'>
                        <p className='lead'>
                            Currently there are no reviews for this doctor
                        </p>
                    </div>
                    
                }
                
            </div>
        </div>
    );
}