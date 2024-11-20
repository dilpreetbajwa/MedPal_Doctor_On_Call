import React, { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaBriefcase } from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { useGetDoctorTimeSlotQuery } from '../../../redux/api/timeSlotApi';
const OverView = ({ doctorDetails }) => {
    const [key, setKey] = useState('sunday');
    const { data: timeSlots, refetch, isLoading, isError } = useGetDoctorTimeSlotQuery({ day: key });
    console.log('doctorDetails: ', doctorDetails);

    return (
        <div className=" rounded-3">
            <div className="col-md-12">
                <div className="mb-3 p-4 rounded-3" style={{ backgroundColor: '#f3f3f3' }}>
                    <h4 className="overview-text">About Me</h4>
                    <p className="text-secondary mb-3">{doctorDetails?.biography}</p>

                    <div className="mb-3">
                        <h4 className="overview-text">Specialization</h4>
                        <div className="text-secondary">{doctorDetails?.specialization}</div>
                    </div>

                    <h4 className="overview-text">Clinic</h4>
                    {doctorDetails?.clinicName && doctorDetails?.clinicAddress ? (
                        <div className="d-flex align-items-center ">
                            <p className="text-secondary">{doctorDetails?.clinicName} @</p>
                            <p className="text-secondary">{doctorDetails?.clinicAddress}</p>
                        </div>
                    ) : (
                        <div className="text-muted">No Clinic information available</div>
                    )}

                    <div>
                        <h4 className="overview-text">Contact Information</h4>
                        <div className="text-secondary">{doctorDetails?.email}</div>
                    </div>
                </div>

                <div className="mb-3 p-4 rounded-3" style={{ backgroundColor: '#f3f3f3' }}>
                    <h4 className="overview-text">Availability</h4>
                    <div>
                        {timeSlots?.length === 0 ? (
                            <div className="text-muted">
                                No available time slots at the moment. Please check back later or contact
                                the clinic for assistance.
                            </div>
                        ) : (
                            // TODO: Need UI to display timeslots
                            <div>Need UI to display timeslots</div>
                        )}
                    </div>
                </div>

                {/* <div>
                <h5 className="overview-text">Education</h5>

                <VerticalTimeline>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="2011 - 2000"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">American Dental Medical University</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>
                            Creative Direction, User Experience, Visual Design, Project Management, Team
                            Leading
                        </p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="2003 - 2005"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">American Dental Medical University</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>
                            Creative Direction, User Experience, Visual Design, Project Management, Team
                            Leading
                        </p>
                    </VerticalTimelineElement>
                </VerticalTimeline>
            </div>
            <div className="my-5">
                <h5 className="overview-text">Work & Experience</h5>

                <VerticalTimeline>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="2010 - Present (5 years)"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">Glowing Smiles Family Dental Clinic</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>
                            Creative Direction, User Experience, Visual Design, Project Management, Team
                            Leading
                        </p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="2007 - 2010 (3 years)"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">Comfort Care Dental Clinic</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>
                            Creative Direction, User Experience, Visual Design, Project Management, Team
                            Leading
                        </p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="2005 - 2007 (2 years)"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">Dream Smile Dental Practice</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur,
                            dignissimos.
                        </p>
                    </VerticalTimelineElement>
                </VerticalTimeline>
            </div>
            <div>
                <h5 className="overview-text">Awards</h5>

                <VerticalTimeline>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="July 2019"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">Humanitarian Award</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a ipsum tellus.
                            Interdum et malesuada fames ac ante ipsum primis in faucibus.
                        </p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="March 2011"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">Certificate for International Volunteer Service</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a ipsum tellus.
                            Interdum et malesuada fames ac ante ipsum primis in faucibus.
                        </p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#00' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="March 2011"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">The Dental Professional of The Year Award</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a ipsum tellus.
                            Interdum et malesuada fames ac ante ipsum primis in faucibus.
                        </p>
                    </VerticalTimelineElement>
                </VerticalTimeline>
            </div>
            <div>
                <h5 className="overview-text">Services</h5>
                <ul>
                    <li>Tooth cleaning </li>
                    <li>Root Canal Therapy</li>
                    <li>Implants</li>
                    <li>Composite Bonding</li>
                    <li>Fissure Sealants</li>
                    <li>Surgical Extractions</li>
                </ul>
            </div>
            <div>
                <h5 className="overview-text">Specializations</h5>
                <ul className="clearfix">
                    <li>Children Care</li>
                    <li>Dental Care</li>
                    <li>Oral and Maxillofacial Surgery </li>
                    <li>Orthodontist</li>
                    <li>Periodontist</li>
                    <li>Prosthodontics</li>
                </ul>
            </div> */}
            </div>
        </div>
    );
};
export default OverView;
