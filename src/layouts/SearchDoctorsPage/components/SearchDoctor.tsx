import { Link } from "react-router-dom";
import { Doctor } from "../../../models/Doctor";

export const SearchDoctor: React.FC<{ doctor: Doctor }> = (props) => {
    return(
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.doctor.profileImg ?
                            <img src={props.doctor.profileImg}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                            :
                            <img src={require('../../../Images/avatar.png')}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center 
                        align-items-center'>
                        {props.doctor.profileImg ?
                            <img src={props.doctor.profileImg}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                            :
                            <img src={require('../../../Images/avatar.png')}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.doctor.name}
                        </h5>
                        <h4>
                            {props.doctor.surname}
                        </h4>
                        <p className='card-text'>
                            {props.doctor.specialization.specialization}
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