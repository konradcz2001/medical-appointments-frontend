import { useEffect, useState } from "react";
import { Doctor } from "../../models/Doctor";
import ReviewModel from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { LatestReviews } from "./components/LatestReviews";
import { Link } from "react-router-dom";
import { useAuth } from "../../security/AuthContext";
import { ScheduleComponent } from "./components/ScheduleComponent";


/**
 * Function component for displaying a doctor's profile page.
 * Fetches doctor information and reviews from the server based on the doctorId.
 * Displays doctor details, reviews, and allows users to make appointments.
 */
export const DoctorProfilePage = () => {

    const { user } = useAuth();
    const [doctor, setDoctor] = useState<Doctor>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const doctorId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchDoctor = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}doctors/${doctorId}`;

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
                address:{
                    country: responseJson.address?.country,
                    state: responseJson.address?.state,
                    city: responseJson.address?.city,
                    street: responseJson.address?.street,
                    houseNumber: responseJson.address?.houseNumber,
                    zipCode: responseJson.address?.zipCode
                },
                isVerified: responseJson.isVerified,
                avatar: responseJson.avatar,
                profileDescription: responseJson.profileDescription,
                specializations: responseJson.specializations,
                typesOfVisits: responseJson.typesOfVisits,
                schedule: {
                    mondayStart: responseJson.schedule?.mondayStart,
                    mondayEnd: responseJson.schedule?.mondayEnd,
                    tuesdayStart: responseJson.schedule?.tuesdayStart,
                    tuesdayEnd: responseJson.schedule?.tuesdayEnd,
                    wednesdayStart: responseJson.schedule?.wednesdayStart,
                    wednesdayEnd: responseJson.schedule?.wednesdayEnd,
                    thursdayStart: responseJson.schedule?.thursdayStart,
                    thursdayEnd: responseJson.schedule?.thursdayEnd,
                    fridayStart: responseJson.schedule?.fridayStart,
                    fridayEnd: responseJson.schedule?.fridayEnd,
                    saturdayStart: responseJson.schedule?.saturdayStart,
                    saturdayEnd: responseJson.schedule?.saturdayEnd,
                    sundayStart: responseJson.schedule?.sundayStart,
                    sundayEnd: responseJson.schedule?.sundayEnd
                }
            };

            setDoctor(loadedDoctor);
            setIsLoading(false);
        };
        fetchDoctor().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [doctorId]);

    useEffect(() => {
        const fetchDoctorReviews = async () => {
            const reviewUrl: string = `${process.env.REACT_APP_API}doctors/${doctorId}/reviews`;

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
                    clientFirstName: responseData[key].clientFirstName,
                    doctorFirstName: responseData[key].doctorFirstName,
                    doctorLastName: responseData[key].doctorLastName
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
    }, [doctorId]);



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
                    <div className='div-img'>
                        {doctor?.avatar ?
                            <img src={`data:image/png;base64,${doctor.avatar}`} alt='avatar' className="img-fluid avatar-img" />
                            :
                            <img src={require('../../Images/avatar.png')} alt='avatar' className="img-fluid avatar-img" />
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
                            
                            <i className="bi bi-geo-alt"></i>
                            {doctor?.address.country || doctor?.address.state || doctor?.address.zipCode || doctor?.address.city || doctor?.address.street || doctor?.address.houseNumber ? <></> : '  (address not provided)  '}                                                                                                                                               
                            {doctor?.address.country ? ' | ' + doctor.address.country : <></>} 
                            {doctor?.address.state ? ' | ' + doctor.address.state : <></>}
                            {doctor?.address.zipCode ? ' | ' + doctor.address.zipCode : <></>} 
                            {doctor?.address.city ? ' | ' + doctor.address.city : <></>} 
                            {doctor?.address.street ? ' | ' + doctor.address.street : <></>} 
                            {doctor?.address.houseNumber ? ' | ' + doctor.address.houseNumber : <></>} 

                        </div>
                    </div>
                </div>
                <div className='row mt-2'>
                    <p className='lead'>{doctor?.profileDescription}</p>
                </div>
                    {
                        doctor?.typesOfVisits ? 
                            <div className='row mt-4' style={{ marginLeft: '20px' }}>
                                <h4>Price-list:</h4>
                                {doctor?.typesOfVisits.length === 0 && 'There are no offers' }

                                <ul className='lead'>
                                    {doctor.typesOfVisits.map(type => {
                                        return(
                                            <li key={type.id}>{type.type} ({type.duration} minutes) - {type.price}{type.currency}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        : <></>
                    }

                    {doctor?.typesOfVisits && user && user?.role !== 'DOCTOR' && doctor?.typesOfVisits.length !== 0 &&
                        <Link type='button' className='btn my-btn mb-5' style={{ marginLeft: '20px' }}
                            to={`/visit/${doctor.id}`} state={{ typesOfVisits: doctor.typesOfVisits, schedule: doctor.schedule }}>
                            Make an appointment <i className="bi bi-journal-bookmark"></i>
                        </Link>
                    }
                    {!user && 
                        <Link className='btn my-btn mb-5' style={{ marginLeft: '20px' }} 
                            to='/login'>
                            Sing in and make an appointment <i className="bi bi-box-arrow-in-right"></i>
                        </Link>
                    }
                    {<ScheduleComponent schedule={doctor?.schedule} />}

                <hr />
                <LatestReviews reviews={reviews} doctorId={doctor?.id} mobile={false} />
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center alighn-items-center'>
                    <div className='div-img'>
                        {doctor?.avatar ?
                            <img src={`data:image/png;base64,${doctor.avatar}`} alt='avatar' className="img-fluid avatar-img" />
                            :
                            <img src={require('../../Images/avatar.png')} alt='avatar' className="img-fluid avatar-img" />
                        }
                    </div>
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
                            <i className="bi bi-geo-alt"></i>
                            {doctor?.address.country || doctor?.address.state || doctor?.address.zipCode || doctor?.address.city || doctor?.address.street || doctor?.address.houseNumber ? <></> : '  (address not provided)  '}                                                                                                                                               
                            {doctor?.address.state ? ' | ' + doctor.address.state : <></>} 
                            {doctor?.address.zipCode ? ' | ' + doctor.address.zipCode : <></>} 
                            {doctor?.address.city ? ' | ' + doctor.address.city : <></>} 
                            {doctor?.address.street ? ' | ' + doctor.address.street : <></>} 
                            {doctor?.address.houseNumber ? ' | ' + doctor.address.houseNumber : <></>} 
                    </div>
                </div>
                
                <div className='row mt-2'>
                    <p className='lead'>{doctor?.profileDescription}</p>
                </div>
                    {
                        doctor?.typesOfVisits ? 
                            <div className='row mt-4' style={{ marginLeft: '20px' }}>
                                <h4>Price-list:</h4>
                                {doctor?.typesOfVisits.length === 0 && 'There are no offers' }

                                <ul className='lead'>
                                    {doctor.typesOfVisits.map(type => {
                                        return(
                                            <li key={type.id}>{type.type} ({type.duration} minutes) - {type.price}{type.currency}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        : <></>
                    }

                    {doctor?.typesOfVisits && user && user?.role !== 'DOCTOR' && doctor?.typesOfVisits.length !== 0 &&
                        <Link type='button' className='btn my-btn mb-5' style={{ marginLeft: '20px' }}
                            to={`/visit/${doctor.id}`} state={{ typesOfVisits: doctor.typesOfVisits, schedule: doctor.schedule }}>
                            Make an appointment <i className="bi bi-journal-bookmark"></i>
                        </Link>
                    }
                    {!user && 
                        <Link className='btn my-btn mb-5' style={{ marginLeft: '20px' }} 
                            to='/login'>
                            Sing in and make an appointment <i className="bi bi-box-arrow-in-right"></i>
                        </Link>
                    }
                    {<ScheduleComponent schedule={doctor?.schedule} />}

                <hr />
                <LatestReviews reviews={reviews} doctorId={doctor?.id} mobile={true} />
            </div>
        </div>



    );
}