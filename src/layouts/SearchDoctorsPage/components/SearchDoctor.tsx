import React from "react";
import { Link } from "react-router-dom";
import { Doctor } from "../../../models/Doctor";
import Highlighter from 'react-highlight-words';

export const SearchDoctor: React.FC<{ doctor: Doctor, searchTerm: string }> = (props) => {
    const { doctor, searchTerm } = props;
    const address = doctor.address;

    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        <div className="div-img-mini">
                            {doctor.avatar ? (
                                <img src={`data:image/png;base64,${doctor.avatar}`} alt='avatar' className="img-fluid avatar-img" />
                            ) : (
                                <img src={require('../../../Images/avatar.png')} alt='avatar' className="img-fluid avatar-img" />
                            )}
                        </div>
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        <div className="div-img-mini">
                            {doctor.avatar ? (
                                <img src={`data:image/png;base64,${doctor.avatar}`} alt='avatar' className="img-fluid avatar-img" />
                            ) : (
                                <img src={require('../../../Images/avatar.png')} alt='avatar' className="img-fluid avatar-img" />
                            )}
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h4 className='card-title'>
                            <Highlighter
                                highlightClassName="search-highlight"
                                searchWords={searchTerm.split(' ')}
                                textToHighlight={`${doctor.firstName} ${doctor.lastName}`}
                            />
                            {doctor.isVerified ? <i className="bi bi-patch-check"></i> : null}
                        </h4>
                        <h5>
                            {doctor.specializations && doctor.specializations.map(specialization => (
                                <React.Fragment key={specialization.id}>
                                    {specialization.specialization + ' '}
                                </React.Fragment>
                            ))}
                        </h5>
                        <p className='card-text'>
                            {address && (address.country || address.state || address.zipCode || address.city || address.street || address.houseNumber) ? (
                                <>
                                    <i className="bi bi-geo-alt"></i>
                                    {address.country && (
                                        <Highlighter
                                            highlightClassName="search-highlight"
                                            searchWords={searchTerm.split(' ')}
                                            textToHighlight={' | ' + address.country}
                                        />
                                    )}
                                    {address.state && (
                                        <Highlighter
                                            highlightClassName="search-highlight"
                                            searchWords={searchTerm.split(' ')}
                                            textToHighlight={' | ' + address.state}
                                        />
                                    )}
                                    {address.zipCode && (
                                        <Highlighter
                                            highlightClassName="search-highlight"
                                            searchWords={searchTerm.split(' ')}
                                            textToHighlight={' | ' + address.zipCode}
                                        />
                                    )}
                                    {address.city && (
                                        <Highlighter
                                            highlightClassName="search-highlight"
                                            searchWords={searchTerm.split(' ')}
                                            textToHighlight={' | ' + address.city}
                                        />
                                    )}
                                    {address.street && (
                                        <Highlighter
                                            highlightClassName="search-highlight"
                                            searchWords={searchTerm.split(' ')}
                                            textToHighlight={' | ' + address.street}
                                        />
                                    )}
                                    {address.houseNumber && (
                                        <Highlighter
                                            highlightClassName="search-highlight"
                                            searchWords={searchTerm.split(' ')}
                                            textToHighlight={' | ' + address.houseNumber}
                                        />
                                    )}
                                </>
                            ) : null}
                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                    <Link type='button' className='btn my-btn' to={`doctor/${doctor.id}`}>View Details</Link>
                </div>
            </div>
        </div>
    );
};
