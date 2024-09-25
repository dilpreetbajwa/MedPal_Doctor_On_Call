import React, { useState , useEffect} from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { Button , message} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import { useChangePasswordMutation } from '../../../redux/api/authApi';

const ChangePassword = () => {
    const { data } = useAuthCheck();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const [changePassword,  { isSuccess, isError, error, isLoading }] = useChangePasswordMutation();
   
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(oldPassword);
        // Basic validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            message.error('All fields are required!');
            return;
        }

        if (newPassword !== confirmPassword) {
            message.error('New Password and Confirm Password do not match!');
            return;
        }
       
        changePassword({
            id:userId,
            newPassword: newPassword
        })
     // Simulating an API call to change the password
     // You can replace this with your actual API call
        setTimeout(() => {
            message.success('Password changed successfully!');
            setPasswordChanged(true);
        }, 1000);
        
    };

    useEffect(() => {
       
        if (data) {
            setUserId(data._id)
        }
        if (passwordChanged) {
            // Reset fields after successful password change
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordChanged(false);
        }
        if (!isLoading && isError) {
            message.error(error?.data?.message)
        }
        if (isSuccess) {
            message.success('Successfully Changed Password')
        }
    }, [passwordChanged, data, isLoading, isError, error, isSuccess]);
    

    return (
        <DashboardLayout>
            <div className="w-100 mb-3 rounded p-2" style={{ background: '#f8f9fa' }}>
                <h5 className='text-title mt-3'>Change Your Password</h5>
                <form className='container row form-row px-5 mx-auto my-5' onSubmit={handleSubmit}>
                    <div className="col-md-12">
                        <div className="form-group mb-3 card-label">
                            <label>Old Password</label>
                            <input   type="password" 
                                     placeholder='Old Password'
                                     className="form-control" 
                                     value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}                       
                            />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group mb-3 card-label">
                            <label>New Password</label>
                            <input type="password" placeholder='New Password' className="form-control" 
                               value={newPassword}
                               onChange={(e) => setNewPassword(e.target.value)}

                            />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group mb-2 card-label">
                            <label>Confirm Password</label>
                            <input type="password" placeholder='Confirm Password' className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='mt-5 text-center'>
                        <Button htmlType='submit' type="primary" size='large'>Save Changes</Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default ChangePassword;