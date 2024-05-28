import { useEffect, useState } from "react";
import { Doctor } from "../../models/Doctor";
import ReviewModel from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const DoctorProfilePage = () => {


    const [doctor, setDoctor] = useState<Doctor>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Book Check Out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    const doctorId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchDoctor = async () => {
            const baseUrl: string = `http://localhost:8080/doctors/${doctorId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedDoctor: Doctor = {

                id: responseJson.id,
                firstName: responseJson.firstName,
                lastName: responseJson.lastName,
                email: responseJson.email,
                role: responseJson.role,
                country: responseJson.address.country,
                state: responseJson.address.state,
                city: responseJson.address.city,
                street: responseJson.address.street,
                number: responseJson.address.houseNumber,
                zipCode: responseJson.address.zipCode,
                isVerified: responseJson.isVerified,
                avatar: responseJson.avatar,
                profileDescription: responseJson.profileDescription,
                specializations: responseJson.specializations

            };

            setDoctor(loadedDoctor);
            setIsLoading(false);
        };
        fetchDoctor().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchDoctorReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/doctors/${doctorId}/reviews`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok && responseReviews.status !== 404) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews.content;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

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
                weightedStarReviews = weightedStarReviews + rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchDoctorReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft]);



    if (isLoading || isLoadingReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

   
    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='d-flex align-items-center mt-5'>
                    <div>
                        {doctor?.avatar ?
                            <img src={doctor?.avatar} 
                                width='256'
                                alt='avatar'
                                className="img-fluid"
                            />
                            :
                            <img src={require('../../Images/avatar.png')}
                                width='256'
                                alt='avatar'
                                className="img-fluid"
                            />
                        }
                    </div>
                    <div>
                        <div className='ml-2'>
                            <h2>{doctor?.firstName} {doctor?.lastName} {doctor?.isVerified ? <i className="bi bi-patch-check"></i> : <></>}</h2>
                            <StarsReview rating={totalStars} size={30} />
                            <h5>
                            {
                                doctor?.specializations ? 
                                doctor.specializations.map(specialization => {
                                    return(
                                        specialization.specialization + ' '
                                    )
                                })
                                : <></>
                            }
                            </h5>
                            
                            {doctor?.country || doctor?.state || doctor?.zipCode || doctor?.city || doctor?.street || doctor?.number ? <i className="bi bi-geo-alt"></i> : <></>}                                                                                                                                               
                            {doctor?.state ? ' | ' + doctor.state : <></>} 
                            {doctor?.zipCode ? ' | ' + doctor.zipCode : <></>} 
                            {doctor?.city ? ' | ' + doctor.city : <></>} 
                            {doctor?.street ? ' | ' + doctor.street : <></>} 
                            {doctor?.number ? ' | ' + doctor.number : <></>} 

                        </div>
                    </div>
                    <CheckoutAndReviewBox doctor={doctor} mobile={false} currentLoansCount={currentLoansCount} 
                        isAuthenticated={true} isCheckedOut={isCheckedOut} 
                        checkoutBook={true} isReviewLeft={isReviewLeft} submitReview={true}/>
                </div>
                <div className='row mt-2'>
                    <p className='lead'>{doctor?.profileDescription}</p>
                </div>
                <hr />
                <LatestReviews reviews={reviews} doctorId={doctor?.id} mobile={false} />
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center alighn-items-center'>
                    {doctor?.avatar ?
                        <img src={doctor?.avatar} 
                            width='256'
                            alt='avatar'
                            className="img-fluid"
                        />
                        :
                        <img src={require('../../Images/avatar.png')}
                            width='256'
                            alt='avatar'
                            className="img-fluid"
                        />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                            <h2>{doctor?.firstName} {doctor?.lastName} {doctor?.isVerified ? 'V' : <></>}</h2>
                            <StarsReview rating={totalStars} size={30} />
                        
                            <h5>
                            {
                                doctor?.specializations ? 
                                doctor.specializations.map(specialization => {
                                    return(
                                        specialization.specialization + ' '
                                    )
                                })
                                : <></>
                            }
                            </h5>
                            
                            {doctor?.country || doctor?.state || doctor?.zipCode || doctor?.city || doctor?.street || doctor?.number ? 'L' : <></>}                                                                                                                                               
                            {doctor?.state ? ' | ' + doctor.state : <></>} 
                            {doctor?.zipCode ? ' | ' + doctor.zipCode : <></>} 
                            {doctor?.city ? ' | ' + doctor.city : <></>} 
                            {doctor?.street ? ' | ' + doctor.street : <></>} 
                            {doctor?.number ? ' | ' + doctor.number : <></>} 
                    </div>
                </div>
                <CheckoutAndReviewBox doctor={doctor} mobile={true} currentLoansCount={currentLoansCount} 
                    isAuthenticated={true} isCheckedOut={isCheckedOut} 
                    checkoutBook={true} isReviewLeft={isReviewLeft} submitReview={true}/>
                
                <div className='row mt-2'>
                    <p className='lead'>{doctor?.profileDescription}</p>
                </div>
                <hr />
                <LatestReviews reviews={reviews} doctorId={doctor?.id} mobile={true} />
            </div>
        </div>



    );
}