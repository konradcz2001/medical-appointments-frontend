import { useEffect, useState } from 'react';
import ReviewModel from '../../../models/ReviewModel';
import { Pagination } from '../../Utils/Pagination';
import { Review } from '../../Utils/Review';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Link } from 'react-router-dom';
import React from 'react';

export const ReviewListPage = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const doctorId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchDoctorReviewsData = async () => {

            const reviewUrl: string = `http://localhost:8080/doctors/${doctorId}/reviews?page=${currentPage - 1}&size=${reviewsPerPage}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews.content;

            setTotalAmountOfReviews(responseJsonReviews.totalElements);
            setTotalPages(responseJsonReviews.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseData) {
                let rating = 0;

                switch(responseData[key].rating){
                    case "ONE_STAR": 
                        rating = 1;
                        break;
                    case "TWO_STARS": 
                        rating = 2;
                        break;
                    case "THREE_STARS": 
                        rating = 3;
                        break;
                    case "FOUR_STARS": 
                        rating = 4;
                        break;
                    case "FIVE_STARS": 
                        rating = 5;
                        break;
                }


                loadedReviews.push({
                    id: responseData[key].id,
                    date: responseData[key].date,
                    rating: rating,
                    description: responseData[key].description,
                    doctor_id: responseData[key].doctorId,
                    client_id: responseData[key].clientId,
                });
            }

            setReviews(loadedReviews);
            setIsLoading(false);
        };
        fetchDoctorReviewsData().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, doctorId, reviewsPerPage]);

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


    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? 
            reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div className="container mt-5">
            <div>
                <h3>Reviews: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
            </p>
            <div className="row">
                {reviews.map(review => (
                    <Review review={review} key={review.id} />
                ))}
                
            </div>
            <div className='m-4'>
                <Link type='button' className='btn my-btn'
                    to={`/doctor/${doctorId}`}>
                    Back to doctor's profile <i className="bi bi-arrow-return-left"></i>
                </Link>
            </div>

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}
