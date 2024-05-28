import { Link } from "react-router-dom";
import { Doctor } from "../../../models/Doctor";
import Highlighter from 'react-highlight-words';

export const SearchDoctor: React.FC<{ doctor: Doctor, searchTerm: string }> = (props) => {
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
                        <h4 className='card-title'>
                            <Highlighter 
                                highlightClassName="search-highlight"
                                searchWords={props.searchTerm.split(' ')}
                                textToHighlight={`${props.doctor.firstName} ${props.doctor.lastName} `} 
                            />
                            {props.doctor.isVerified ? <i className="bi bi-patch-check"></i> : <></>}
                        </h4>
                        <h5>
                            {
                                props.doctor.specializations ? 
                                props.doctor.specializations.map(specialization => {
                                    return(
                                        <Highlighter 
                                            key={specialization.id}
                                            highlightClassName="search-highlight"
                                            searchWords={props.searchTerm.split(' ')}
                                            textToHighlight={specialization.specialization + ' '} 
                                        />
                                    )
                                })
                                : <></>
                            }
                        </h5>
                        <p className='card-text'>
                            {props.doctor.country || props.doctor.state || props.doctor.zipCode || props.doctor.city || props.doctor.street || props.doctor.number ? <i className="bi bi-geo-alt"></i> : <></>}
                            {props.doctor.country ? <Highlighter 
                                                        highlightClassName="search-highlight"
                                                        searchWords={props.searchTerm.split(' ')}
                                                        textToHighlight={' | ' + props.doctor.country} 
                                                    /> : <></>} 
                            {props.doctor.state ? <Highlighter 
                                                        highlightClassName="search-highlight"
                                                        searchWords={props.searchTerm.split(' ')}
                                                        textToHighlight={' | ' + props.doctor.state} 
                                                    /> : <></>} 
                            {props.doctor.zipCode ? <Highlighter 
                                                        highlightClassName="search-highlight"
                                                        searchWords={props.searchTerm.split(' ')}
                                                        textToHighlight={' | ' + props.doctor.zipCode} 
                                                    /> : <></>} 
                            {props.doctor.city ? <Highlighter 
                                                        highlightClassName="search-highlight"
                                                        searchWords={props.searchTerm.split(' ')}
                                                        textToHighlight={' | ' + props.doctor.city} 
                                                    /> : <></>} 
                            {props.doctor.street ? <Highlighter 
                                                        highlightClassName="search-highlight"
                                                        searchWords={props.searchTerm.split(' ')}
                                                        textToHighlight={' | ' + props.doctor.street} 
                                                    /> : <></>} 
                            {props.doctor.number ? <Highlighter 
                                                        highlightClassName="search-highlight"
                                                        searchWords={props.searchTerm.split(' ')}
                                                        textToHighlight={' | ' + props.doctor.number} 
                                                    /> : <></>}                                                                                                                         

                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                        <Link type='button' className='btn my-btn' to={`doctor/${props.doctor.id}`}>View Details</Link>
                </div>
            </div>
        </div>
    );
}