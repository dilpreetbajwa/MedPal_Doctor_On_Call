import React, { useEffect } from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import img from '../../../images/avatar.jpg';
import dummy_pic from '../../../images/dummy_pic2.jpg';

import './Appointments.css';
import { useGetDoctorAppointmentsQuery, useUpdateAppointmentMutation } from '../../../redux/api/appointmentApi';
import moment from 'moment';
import { Button, Empty, message, Tag, Tooltip } from 'antd';
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaClock, FaEnvelope, FaLocationArrow, FaPhoneAlt, FaBriefcaseMedical } from "react-icons/fa";
import { clickToCopyClipBoard } from '../../../utils/copyClipBoard';

const Appointments = () => {
    const { data, isError, isLoading } = useGetDoctorAppointmentsQuery({});
    const [updateAppointment, { isError: updateIsError, isSuccess, error }] = useUpdateAppointmentMutation();

    const updatedApppointmentStatus = (id, type) => {
        const changeObj = {
            status: type
        }
        if (id) {
            updateAppointment({ id, data: changeObj })
        }
    }

    useEffect(() => {
        if (isSuccess) {
            message.success("Succcessfully Appointment Updated")
        }
        if (isError) {
            message.error(error?.data?.message);
        }
    }, [isSuccess, updateIsError, error])

    const getInitPatientName = () => {
        const fullName = `${data?.patientId?.firstName ?? ''} ${data?.patientId?.lastName ?? ''}`;
        return fullName.trim() || "Private Patient";
    }

    let content = null;
    if (!isLoading && isError) content = <div>Something Went Wrong !</div>
    if (!isLoading && !isError && data?.length === 0) content = <Empty />
    if (!isLoading && !isError && data?.length > 0) content =
        <>
            {
                data && data.map((item) => (
                    <div className="w-100 mb-3 rounded p-3" style={{ background: '#f8f9fa' }} key={item.id}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <Link to={`/`} className="patient-img">
                                    <img src={data?.patientId?.img ? data?.patientId?.img : dummy_pic} alt="" />
                                </Link>
                                <div className="patients-info">
                                    <h5>{item?.patientId?.firstName ?? " "}{" "} {item?.patientId?.lastName?? " "}</h5>
                                    {/* <Tooltip title="Copy Tracking Id">
                                        <Button>
                                            <h6>Tracking<Tag color="#87d068" className='ms-2 text-uppercase' onClick={() => clickToCopyClipBoard(item?.trackingId)}>{item?.trackingId}</Tag></h6>
                                        </Button>
                                    </Tooltip> */}

                                    <div className="info mt-1">
                                        <p><FaClock className='icon' /> {moment(item?.appointmentTime).format("MMM Do YY")} </p>
                                        {item?.patientId?.address && <p><FaLocationArrow className='icon' /> {item?.patientId?.address}</p>}
                                        {item?.patientId?.email && <p><FaEnvelope className='icon' /> {item?.patientId?.email}</p>}
                                        {item?.patientId?.address && <p><FaPhoneAlt className='icon' />{item?.patientId?.address}</p>}

                                    </div>
                                </div>
                                <div className='appointment-status card p-3 border-primary'>
                                    <p>Current Status - <span><Tag color="#f50" className='text-uppercase text-xs font-medium me-2 px-2.5 py-0.5'>{item?.status}</Tag></span></p>
                                    <p>Patient Status - <span><Tag color="#2db7f5" className='text-uppercase text-xs font-medium me-2 px-2.5 py-0.5'>{item?.patientType}</Tag></span></p>
                                    <p>Is Follow Up - <span><Tag color="#f50" className='text-uppercase text-xs font-medium me-2 px-2.5 py-0.5'>{item?.isFollowUp ? "Yes" : "No"}</Tag></span></p>
                                    <p> Is Paid - <span><Tag color="#87d068" className='text-uppercase text-xs font-medium me-2 px-2.5 py-0.5'>{item?.paymentStatus}</Tag></span></p>
                                    <p> Prescribed - <span><Tag color="#2db7f5" className='text-uppercase text-xs font-medium me-2 px-2.5 py-0.5'>{item?.prescriptionStatus}</Tag></span></p>
                                </div>
                            </div>
                            <div className='d-flex gap-2' variant="filled">
                                <Link to={`/dashboard/appointments/${item?._id}`}>
                                    <Button type="primary" variant="filled" icon={<FaEye />} size="small">View</Button>
                                </Link>
                                {
                                    item.prescriptionStatus === 'notIssued'
                                        ?
                                        <Link to={`/dashboard/appointment/treatment/${item?.id}`}>
                                            <Button type="primary" variant="filled" icon={<FaBriefcaseMedical />} size="small">Treatment</Button>
                                        </Link>
                                        :
                                        <Link to={`/dashboard/prescription/${item?.prescription[0]?.id}`}>
                                            <Button type="primary"  variant="filled" icon={<FaEye />} size="small" >Prescription</Button>
                                        </Link>
                                }
                                {
                                    item?.isFollowUp && <Link to={`/dashboard/appointment/treatment/edit/${item?.prescription[0]?.id}`}>
                                        <Button type="primary" variant="filled" icon={<FaBriefcaseMedical />} size="small">Follow Up</Button>
                                    </Link>
                                }

                                {
                                    item?.status === 'pending' &&
                                    <>
                                        <Button type="primary" icon={<FaCheck />} size="small" onClick={() => updatedApppointmentStatus(item.id, 'scheduled')}>Accept</Button>
                                        <Button type='primary' icon={<FaTimes />} size="small" danger onClick={() => updatedApppointmentStatus(item.id, 'cancel')}>Cancel</Button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    return (
        <DashboardLayout>
            {content}
        </DashboardLayout>
    )
}

export default Appointments