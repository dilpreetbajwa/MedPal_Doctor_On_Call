import React, { useEffect, useState } from 'react';
import { FaCheck, FaEnvelope, FaLock, FaTimes, FaUser } from 'react-icons/fa';
import SocialSignUp from './SocialSignUp';
import Spinner from 'react-bootstrap/Spinner';
import swal from 'sweetalert';
import { useDoctorSignUpMutation, usePatientSignUpMutation } from '../../redux/api/authApi';
import { message, Input, Select } from 'antd';
import UseModal from '../UI/UseModal';
// password regex
// ^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$
// At least one upper case English letter, (?=.*?[A-Z])
// At least one lower case English letter, (?=.*?[a-z])
// At least one digit, (?=.*?[0-9])
// At least one special character, (?=.*?[#?!@$%^&*-])
// Minimum eight in length .{8,} (with the anchors)

const SignUp = ({ setSignUp }) => {
    const [error, setError] = useState({});
    const [infoError, setInfoError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formField = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        designation: '',
        specialization: '',
        price: null,
        clinicAddress: '',
        clinicName: '',
        services: '',
        gender: '',
    };
    //designation, specialization, price /hr, clinic name&address, services
    const [user, setUser] = useState(formField);
    const [userType, setUserType] = useState('patient');
    const [
        doctorSignUp,
        { data: dData, isSuccess: dIsSuccess, isError: dIsError, error: dError, isLoading: dIsLoading },
    ] = useDoctorSignUpMutation();
    const [
        patientSignUp,
        { data: pData, isSuccess: pIsSuccess, isError: pIsError, error: pError, isLoading: pIsLoading },
    ] = usePatientSignUpMutation();
    const [passwordValidation, setPasswordValidation] = useState({
        carLength: false,
        specailChar: false,
        upperLowerCase: false,
        numeric: false,
    });

    const handleSignUpSuccess = () => {
        setLoading(false);
        setUser(formField);
        setIsModalOpen(false);
        setPasswordValidation({
            carLength: false,
            specailChar: false,
            upperLowerCase: false,
            numeric: false,
        });
        setEmailError({ emailError: false });
    };
    useEffect(() => {
        // doctor account
        if (dIsError && dError) {
            message.error(`${dError?.data?.message ?? 'Email Already Exist !!'}`);
            setLoading(false);
        }

        if (!dIsError && dIsSuccess) {
            handleSignUpSuccess();
            setLoading(false);
            swal({
                icon: 'success',
                text: `Successfully Account Created Please Verify Your email`,
                timer: 5000,
            });
        }

        // Patient account
        if (pIsError && pError) {
            console.log('pIsError', pIsError, pError);
            message.error('Email Already Exist !!');
            setLoading(false);
        }
        if (!pIsError && pIsSuccess) {
            handleSignUpSuccess();
            setLoading(false);
            setSignUp(false);
            swal({
                icon: 'success',
                text: `Successfully ${
                    userType === 'doctor' ? 'Doctor' : 'Patient'
                } Account Created Please Login`,
                timer: 2000,
            });
        }
    }, [
        dIsError,
        dError,
        pError,
        pIsError,
        ,
        pIsLoading,
        dIsLoading,
        pData,
        dData,
        setSignUp,
        setLoading,
        dIsSuccess,
    ]);

    const [emailError, setEmailError] = useState({
        emailError: false,
    });

    const handleEmailError = (value) => {
        setEmailError({
            emailError: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        });
    };
    const hanldeValidation = (value) => {
        setPasswordValidation({
            carLength: value.length > 8,
            specailChar: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value),
            upperLowerCase: /^(?=.*[a-z])(?=.*[A-Z])/.test(value),
            numeric: /^(?=.*\d)/.test(value),
        });
    };

    const hanldeOnChange = (e) => {
        let { name, value } = e.target;
        if (name === 'email') handleEmailError(value);
        if (name === 'password') hanldeValidation(value);
        setUser((user) => ({
            ...user,
            [name]: value,
        }));
        // if (value === 'email') {
        //     isPassValid = /\S+@\S+\.\S+/.test(value);
        // }
        // if (value === 'password') {
        //     isPassValid =
        //         value.length > 8 &&
        //         /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value) &&
        //         /^(?=.*[a-z])(?=.*[A-Z])/.test(value) &&
        //         /^(?=.*\d)/.test(value);
        // }
        // if (isPassValid) {
        //     const newPass = { ...user };
        //     newPass[name] = value;
        //     setUser(newPass);
        // }
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };
    const hanldeOnSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (userType === 'doctor') {
            setIsModalOpen(true);
        } else {
            patientSignUp(user);
        }
    };
    // console.log(user);
    const handleMoreDetails = (e) => {
        const { name, value } = e?.target || {};
        if (name && value) {
            setUser((user) => ({
                ...user,
                [name]: value,
            }));
        }
    };

    return (
        <React.Fragment>
            <form className="sign-up-form" onSubmit={hanldeOnSubmit}>
                <h2 className="title">Sign Up</h2>
                <div className="input-field">
                    <span className="fIcon">
                        <FaUser />
                    </span>
                    <input
                        placeholder="First Name"
                        name="firstName"
                        type="text"
                        onChange={(e) => hanldeOnChange(e)}
                        value={user.firstName}
                    />
                </div>
                <div className="input-field">
                    <span className="fIcon">
                        <FaUser />
                    </span>
                    <input
                        placeholder="Last Name"
                        name="lastName"
                        type="text"
                        onChange={(e) => hanldeOnChange(e)}
                        value={user.lastName}
                    />
                </div>
                <div className="input-field">
                    <span className="fIcon">
                        <FaEnvelope />
                    </span>
                    <input
                        placeholder="Email"
                        name="email"
                        type="email"
                        onChange={(e) => hanldeOnChange(e)}
                        value={user.email}
                    />
                </div>
                <div className="input-field">
                    <span className="fIcon">
                        <FaLock />
                    </span>
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={(e) => hanldeOnChange(e)}
                        value={user.password}
                    />
                </div>
                <div className="input-field d-flex align-items-center gap-2 justify-content-center">
                    <div className="text-nowrap">I'M A</div>
                    <select
                        className="form-select w-50"
                        aria-label="select"
                        onChange={(e) => handleUserTypeChange(e)}
                        defaultValue="patient"
                    >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>
                {error.length && <h6 className="text-danger text-center">{error}</h6>}
                {infoError && <h6 className="text-danger text-center">{infoError}</h6>}
                <button
                    type="submit"
                    className="btn btn-primary btn-block mt-2 iBtn"
                    disabled={
                        passwordValidation.carLength &&
                        passwordValidation.numeric &&
                        passwordValidation.upperLowerCase &&
                        passwordValidation.specailChar &&
                        emailError.emailError
                            ? ''
                            : true
                    }
                >
                    {loading ? <Spinner animation="border" variant="info" /> : 'Sign Up'}
                </button>

                <div className="password-validatity mx-auto">
                    <div style={emailError.emailError ? { color: 'green' } : { color: 'red' }}>
                        <p>
                            {passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                            <span className="ms-2">Must Have Valid Email.</span>
                        </p>
                    </div>

                    <div style={passwordValidation.carLength ? { color: 'green' } : { color: 'red' }}>
                        <p>
                            {passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                            <span className="ms-2">Password Must Have atlast 8 character.</span>
                        </p>
                    </div>

                    <div style={passwordValidation.specailChar ? { color: 'green' } : { color: 'red' }}>
                        <p>
                            {passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                            <span className="ms-2">Password Must Have a special cracter.</span>
                        </p>
                    </div>

                    <div style={passwordValidation.upperLowerCase ? { color: 'green' } : { color: 'red' }}>
                        <p>
                            {passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                            <span className="ms-2">Password Must Have uppercase and lower case.</span>
                        </p>
                    </div>

                    <div style={passwordValidation.numeric ? { color: 'green' } : { color: 'red' }}>
                        <p>
                            {passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                            <span className="ms-2">Password Must Have Number.</span>
                        </p>
                    </div>
                </div>

                <p className="social-text">Or Sign up with social account</p>
                <SocialSignUp />
            </form>
            <UseModal
                isModaOpen={isModalOpen}
                title={'We would like to know you more!'}
                handleCancel={() => {
                    setIsModalOpen(false);
                }}
                handleOk={() => {
                    doctorSignUp(user);
                }}
                okText={'Submit'}
            >
                <form className="row form-row" onSubmit={() => {}}>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label className="position-relative">
                                Designation <span className="text-danger">*</span>
                            </label>
                            <Input
                                onChange={handleMoreDetails}
                                name="designation"
                                className="form-control"
                                value={user.designation}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label className="position-relative">
                                Pricing <span className="text-danger">*</span>
                            </label>
                            <Input
                                type="number"
                                name="price"
                                onChange={handleMoreDetails}
                                className="form-control"
                                value={user.price}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label className="position-relative">
                                Gender <span className="text-danger">*</span>
                            </label>
                            <select
                                className="form-control select"
                                onChange={handleMoreDetails}
                                name="gender"
                                value={user.gender}
                                style={{ marginTop: '-10px' }}
                            >
                                <option value={''}>Select</option>
                                <option className="text-capitalize">male</option>
                                <option className="text-capitalize">female</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label className="position-relative">
                                Specialization <span className="text-danger">*</span>
                            </label>
                            <Input
                                name="specialization"
                                onChange={handleMoreDetails}
                                className="form-control"
                                value={user.specialization}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label className="position-relative">
                                Clinic Name <span className="text-danger">*</span>
                            </label>
                            <Input
                                name="clinicName"
                                onChange={handleMoreDetails}
                                className="form-control"
                                value={user.clinicName}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label className="position-relative">
                                Clinic Address <span className="text-danger">*</span>
                            </label>
                            <Input
                                name="clinicAddress"
                                onChange={handleMoreDetails}
                                className="form-control"
                                value={user.clinicAddress}
                            />
                        </div>
                    </div>
                </form>
            </UseModal>
        </React.Fragment>
    );
};

export default SignUp;
