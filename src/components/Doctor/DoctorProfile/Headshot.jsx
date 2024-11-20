import React from 'react';
import { Link } from 'react-router-dom';

const Headshot = ({ doctorDetails }) => {
    console.log({ doctorDetails });
    const services = doctorDetails?.services?.split(',') ?? [];
    const defaultUserUrl = process.env.REACT_APP_DEFAULT_USER_IMAGE;

    // style={{ background: '#f3f3f3' }}
    return (
        <div className="mb-4">
            <div className="d-flex p-3 justify-content-center">
                <div className="d-flex flex-column gap-3">
                    <div className="doc-img-fluid d-flex align-items-center">
                        <img src={doctorDetails?.img ?? defaultUserUrl} className="" alt="User Image" />
                    </div>
                    <div className="doc-info d-flex flex-column align-items-center">
                        <h5 className="mb-0">
                            <Link>Dr. {doctorDetails?.firstName + ' ' + doctorDetails?.lastName}</Link>
                        </h5>
                        <p className="mb-1 form-text d-inline">{doctorDetails?.designation ?? 'Doctor'}</p>
                        <p className="mb-1 form-text d-inline">
                            {doctorDetails?.price ? `$${doctorDetails?.price} /Hr` : ''}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Headshot;
