import { useEffect, useState } from "react";
import { Doctor } from "../../models/Doctor";
import ReviewModel from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { LatestReviews } from "./components/LatestReviews";
import { Link } from "react-router-dom";
import { useAuth } from "../../security/AuthContext";


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
            console.log('doc id: ', doctorId);
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
                address:{
                country: responseJson.address.country,
                state: responseJson.address.state,
                city: responseJson.address.city,
                street: responseJson.address.street,
                houseNumber: responseJson.address.houseNumber,
                zipCode: responseJson.address.zipCode
                },
                isVerified: responseJson.isVerified,
                avatar: responseJson.avatar,
                profileDescription: responseJson.profileDescription,
                specializations: responseJson.specializations,
                typesOfVisits: responseJson.typesOfVisits
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
                            
                            {doctor?.address.country || doctor?.address.state || doctor?.address.zipCode || doctor?.address.city || doctor?.address.street || doctor?.address.houseNumber ? <i className="bi bi-geo-alt"></i> : <></>}                                                                                                                                               
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
                            <div className='row mt-2' style={{ marginLeft: '20px' }}>
                                <h4>Price-list:</h4>
                                <ul className='lead'>
                                    {doctor.typesOfVisits.map(type => {
                                        return(
                                            <li>{type.type} | {type.price}{type.currency}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        : <></>
                    }
                    {doctor?.typesOfVisits && user && user?.role !== 'DOCTOR' &&
                        <Link type='button' className='btn my-btn ml-3' style={{ marginLeft: '20px' }}
                            to={`/visit/${doctor.id}`}>
                            Make an appointment
                        </Link>
                    }

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
                            
                            {doctor?.address.country || doctor?.address.state || doctor?.address.zipCode || doctor?.address.city || doctor?.address.street || doctor?.address.houseNumber ? 'L' : <></>}                                                                                                                                               
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
                            <div className='row mt-2' style={{ marginLeft: '20px' }}>
                                <h4>Price-list:</h4>
                                <ul className='lead'>
                                    {doctor.typesOfVisits.map(type => {
                                        return(
                                            <li>{type.type} | {type.price}{type.currency}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        : <></>
                    }
                    {doctor?.typesOfVisits && user && user?.role !== 'DOCTOR' &&
                        <Link type='button' className='btn my-btn ml-3' style={{ marginLeft: '20px' }}
                            to={`/visit/${doctor.id}`}>
                            Make an appointment
                        </Link>
                    }
                <hr />
                <LatestReviews reviews={reviews} doctorId={doctor?.id} mobile={true} />
            </div>
        </div>



    );
}