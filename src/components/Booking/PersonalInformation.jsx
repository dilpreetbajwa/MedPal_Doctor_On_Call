import { Checkbox, message } from 'antd';
import { useEffect, useState } from 'react';
import useAuthCheck from '../../redux/hooks/useAuthCheck';

const PersonalInformation = ({ handleChange, selectValue, setIsFormValid, setPatientId = () => {} }) => {
    const { firstName, lastName, email, phone, reasonForVisit, description, address } = selectValue;
    const [checked, setChecked] = useState(false);
    const { data } = useAuthCheck();

    // State for validation errors
    const [errors, setErrors] = useState({});
    const onChange = (e) => {
        setChecked(e.target.checked);
    };
    useEffect(() => {
        console.log(data);
        if (checked) {
            if (data.id) {
                setPatientId(data.id);
                message.success("User Has Found!");
            } else {
                message.error("User is not Found, Please Login!");
            }
        }
    }, [checked, data, setPatientId]);

    // Validation function
    const validate = () => {
        const newErrors = {};
        if (!firstName) newErrors.firstName = "First name is required.";
        if (!lastName) newErrors.lastName = "Last name is required.";
        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email address is invalid.";
        }
        if (!phone) {
            newErrors.phone = "Phone number is required.";
        } 
        if (!reasonForVisit) newErrors.reasonForVisit = "Reason for visit is required.";
        if (!description) newErrors.description = "Description is required.";
        if (!address) newErrors.address = "Address is required.";
        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0); // Returns true if no errors
       
    };


    const handleInputChange = (e) => {
        handleChange(e);
        validate(); // Validate on input change
    };

    return (
        <form className="rounded p-3 mt-5" style={{ background: "#f8f9fa" }}>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>First Name</label>
                        <input onChange={handleInputChange} name='firstName' value={firstName || ''} className="form-control" type="text" />
                        {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Last Name</label>
                        <input onChange={handleInputChange} name='lastName' value={lastName || ''} className="form-control" type="text" />
                        {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Email</label>
                        <input onChange={handleInputChange} name='email' value={email || ''} className="form-control" type="email" />
                        {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Phone</label>
                        <input onChange={handleInputChange} name='phone' value={phone || ''} className="form-control" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" maxLength={10}/>
                        {errors.phone && <small className="text-danger">{errors.phone}</small>}
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Reason For Visit</label>
                        <textarea rows={8} onChange={handleInputChange} name='reasonForVisit' value={reasonForVisit || ''} className="form-control" />
                        {errors.reasonForVisit && <small className="text-danger">{errors.reasonForVisit}</small>}
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Description</label>
                        <textarea rows={8} onChange={handleInputChange} name='description' value={description || ''} className="form-control" />
                        {errors.description && <small className="text-danger">{errors.description}</small>}
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Address</label>
                        <input onChange={handleInputChange} name='address' value={address || ''} className="form-control" type="text" />
                        {errors.address && <small className="text-danger">{errors.address}</small>}
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PersonalInformation;