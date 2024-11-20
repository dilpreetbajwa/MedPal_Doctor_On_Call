import React from 'react';
import Footer from '../../Shared/Footer/Footer';
import './index.css';
import { useParams } from 'react-router-dom';
import Header from '../../Shared/Header/Header';
import SubHeader from '../../Shared/SubHeader';
import { useGetDoctorQuery } from '../../../redux/api/doctorApi';
import { Empty, message } from 'antd';
import SearchContent from '../SearchDoctor/SearchContent';
import { Tabs } from 'antd';
import OverView from './OverView';
import Location from './Location';
import Review from './Review';
import Availibility from './Availibility';
import Headshot from './Headshot';

const DoctorProfile = () => {
    const { id } = useParams();
    const { data: doctorDetails, isLoading, isError } = useGetDoctorQuery(id);

    let content = null;
    if (!isLoading && isError) content = <div>{message.error('Something went Wrong!')}</div>;
    if (!isLoading && !isError && doctorDetails?._id === undefined) content = <Empty />;
    // if (!isLoading && !isError && doctorDetails?._id) content = <SearchContent data={doctorDetails} />;
    if (!isLoading && !isError && doctorDetails?._id) content = <Headshot doctorDetails={doctorDetails} />;

    const items = [
        {
            key: '1',
            label: 'Overview',
            children: <OverView doctorDetails={doctorDetails} />,
        },
        {
            key: '2',
            label: 'Locations',
            children: <Location />,
        },
        // {
        //     key: '3',
        //     label: 'Reviews',
        //     children: <Review doctorId={id} />,
        // },
        {
            key: '4',
            label: 'Availability',
            children: <Availibility />,
        },
    ];

    return (
        <>
            <Header />
            <SubHeader title="Doctor Details" subtitle="Lorem ipsum dolor sit amet." />

            <div className="container" style={{ marginBottom: '4rem', marginTop: '6rem' }}>
                {content}
                {/* <div className="p-4 rounded" style={{ marginBottom: '7rem', backgroundColor: '#f3f3f3' }}>
                    <Tabs defaultActiveKey="1" items={items} />
                </div> */}

                <OverView doctorDetails={doctorDetails} />
            </div>
            <Footer />
        </>
    );
};

export default DoctorProfile;
