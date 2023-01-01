import { Link } from "react-router-dom";
import { Doctor } from "../../../models/Doctor";

export const SearchDoctor: React.FC<{ doctor: Doctor }> = (props) => {
    return(
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.doctor.avatar ?
                            <img src={props.doctor.avatar}
                                width='123'
                                alt='avatar'
                                className="img-fluid"
                            />
                            :
                            <img src={require('../../../Images/avatar.png')}
                                width='123'
                                alt='avatar'
                                className="img-fluid"
                            />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center 
                        align-items-center'>
                        {props.doctor.avatar ?
                            <img src={props.doctor.avatar}
                                width='123'
                                alt='avatar'
                                className="img-fluid"
                            />
                            :
                            <img src={require('../../../Images/avatar.png')}
                                width='123'
                                alt='avatar'
                                className="img-fluid"
                            />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.doctor.firstName} {props.doctor.lastName}
                        </h5>
                        <h4>
                            City: {props.doctor.city}   Specializations: {
                                props.doctor.specializations.map(specialization => specialization.specialization + ' ')
                            }
                        </h4>
                        <p className='card-text'>
                            {props.doctor.profileDescription}
                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                        <Link className='' to='#'>View Details</Link>
                </div>
            </div>
        </div>
    );
}