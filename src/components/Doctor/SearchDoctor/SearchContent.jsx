import React from 'react';
import { Link } from 'react-router-dom';
import showImg from '../../../images/specialities/specialities-01.png';
import StarRatings from 'react-star-ratings';
import { Tag } from 'antd';
import './index.css';
import { FaLocationArrow, FaRegThumbsUp, FaDollarSign, FaComment } from 'react-icons/fa';
import { ImLocation } from 'react-icons/im';
import { truncate } from '../../../utils/truncate';

const SearchContent = ({ data }) => {
    console.log('SearchContent: ', data);

    const services = data?.services?.split(',') ?? [];
    const defaultUserUrl = process.env.REACT_APP_DEFAULT_USER_IMAGE;
    return (
        <div className="mb-4 rounded" style={{ background: '#f3f3f3' }}>
            <div className="d-flex p-3 justify-content-between">
                <div className="d-flex gap-3">
                    <div className="doc-img-fluid d-flex align-items-center">
                        {data?.img ? (
                            <img src={data?.img} className="" alt="User Image" />
                        ) : (
                            <img src={defaultUserUrl} alt="default user" />
                        )}
                    </div>
                    <div className="doc-info d-flex flex-column">
                        <h5 className="mb-0">
                            <Link to={`/doctors/profile/${data?._id}`}>
                                Dr. {data?.firstName + ' ' + data?.lastName}
                            </Link>
                        </h5>

                        {data?.designation ? (
                            <p className="mb-1 form-text">{data.designation}</p>
                        ) : (
                            <p className="mb-1 form-text">Doctor</p>
                        )}
                        <div className="form-text">{data?.biography ?? ''}</div>

                        <div className="mt-auto">
                            {data?.specialization && (
                                <div className="doc-department">
                                    <img src={showImg} className="img-fluid" alt="Speciality" />
                                    {data.specialization}
                                </div>
                            )}

                            {/* Commented since its Static */}
                            {/* <div className="d-flex align-items-center">
                            <div>
                                <StarRatings
                                    rating={5}
                                    starRatedColor="#f4c150"
                                    numberOfStars={5}
                                    name="rating"
                                    starDimension="15px"
                                    starSpacing="2px"
                                />
                                </div>
                                <div>(4)</div>
                            </div> */}

                            <div className="clinic-details">
                                <div className="text-secondary my-1 d-flex align-items-center">
                                    {data?.clinicAddress && <ImLocation />}
                                    {data?.clinicAddress}
                                </div>
                                {/* <ul className="clinic-gallery mt-3">
                                <li>
                                    <img src={showImg} alt="Feature" style={{ maxWidth: '30px' }} />
                                </li>
                                <li>
                                    <img src={showImg} alt="Feature" style={{ maxWidth: '30px' }} />
                                </li>
                                <li>
                                    <img src={showImg} alt="Feature" style={{ maxWidth: '30px' }} />
                                </li>
                                <li>
                                    <img src={showImg} alt="Feature" style={{ maxWidth: '30px' }} />
                                </li>
                            </ul> */}
                            </div>
                            {services.map((item, id) => (
                                <Tag key={id}>{item}</Tag>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column me-3">
                    <div className="clini-infos">
                        <ul>
                            {/* 
                            Commented since its static
                            
                            <li>
                                <FaRegThumbsUp /> 97%
                            </li>
                            <li>
                                <FaComment /> 4 Feedback
                            </li> 
                            */}
                            {data?.price && (
                                <li className="text-secondary d-flex align-items-center">
                                    <FaDollarSign /> {truncate(data.price, 4)}/Hr
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="clinic-booking mt-auto">
                        <Link to={`/doctors/profile/${data?._id}`} className="view-pro-btn">
                            View Profile
                        </Link>
                        <Link to={`/booking/${data?._id}`} className="apt-btn">
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SearchContent;
