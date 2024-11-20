import React from 'react';
import img from '../../images/avatar.jpg';
import './DashboardSidebar.css';
import { Link, NavLink } from 'react-router-dom';
import useAuthCheck from '../../redux/hooks/useAuthCheck';
import {
    FaTable,
    FaCalendarDay,
    FaUserInjured,
    FaHourglassStart,
    FaRegStar,
    FaUserCog,
    FaBlog,
    FaSignOutAlt,
    FaLock,
    FaHouseUser,
} from 'react-icons/fa';

const DashboardSidebar = () => {
    const { data: authData, role } = useAuthCheck();

    const patient_sidebar_menu = [
        {
            link: '/dashboard',
            name: 'Dashboard',
            icon: <FaTable className="icon" />,
        },
        {
            link: '/dashboard/profile-setting',
            name: 'Profile Setting',
            icon: <FaUserCog className="icon" />,
        },
        {
            link: '/dashboard/change-password',
            name: 'Change Password',
            icon: <FaLock className="icon" />,
        },
        {
            link: '/',
            name: 'Logout',
            icon: <FaSignOutAlt className="icon" />,
        },
    ];

    const doctor_menu_item = [
        {
            link: '/dashboard',
            name: 'Dashboard',
            icon: <FaTable className="icon" />,
        },
        {
            link: '/dashboard/appointments',
            name: 'Appointments',
            icon: <FaCalendarDay className="icon" />,
        },
        {
            link: '/dashboard/my-patients',
            name: 'My Patients',
            icon: <FaUserInjured className="icon" />,
        },
        {
            link: '/dashboard/prescription',
            name: 'Prescription',
            icon: <FaUserInjured className="icon" />,
        },
        {
            link: '/dashboard/schedule',
            name: 'Schedule Timings',
            icon: <FaCalendarDay className="icon" />,
        },

        {
            link: '/dashboard/profile-setting',
            name: 'Profile Settings',
            icon: <FaUserCog className="icon" />,
        },
        {
            link: '/dashboard/change-password',
            name: 'Change Password',
            icon: <FaLock className="icon" />,
        },
        {
            link: '/',
            name: 'Logout',
            icon: <FaSignOutAlt className="icon" />,
        },
    ];
    return (
        <div className="profile-sidebar p-3 rounded">
            <div className="p-2 text-center border-bottom">
                <div className="profile-info text-center">
                    <Link to={'/'}>
                        <img src={authData?.img ? authData?.img : img} alt="" />
                    </Link>
                    <div className="profile-details">
                        <h5 className="mb-0">{authData?.firstName + ' ' + authData?.lastName}</h5>
                        <div>
                            {role === 'doctor' && (
                                <p className="mb-0">{authData?.designation ?? 'Designation'}</p>
                            )}
                            <p className="mb-0">{authData?.email ?? 'Designation'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <nav className="dashboard-menu">
                {role === 'patient' ? (
                    <ul>
                        {patient_sidebar_menu?.map((menu, index) => {
                            return (
                                <li>
                                    <NavLink to={menu.link} activeClassName="active" end>
                                        {menu.icon}
                                        <span>{menu.name}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <ul>
                        {doctor_menu_item?.map((menu, index) => {
                            return (
                                <li>
                                    <NavLink to={menu.link} activeClassName="active" end>
                                        {menu.icon}
                                        <span>{menu.name}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </nav>
        </div>
    );
};
export default DashboardSidebar;
