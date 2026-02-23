import React, { useEffect, useState } from 'react';
import { Doctor } from '../../models/Doctor';
import { LeavesManagement } from './components/LeavesManagement';
import { SpecializationsManagement } from './components/SpecializationsManagement';
import { VisitsManagementByDoctor } from './components/VisitsManagementByDoctor';
import { useAuth } from '../../security/AuthContext';
import { ScheduleManagement } from './components/ScheduleManagement';
import { Schedule } from '../../models/Schedule';
import { TypesOfVisitsManagement } from './components/TypesOfVisitsManagement';

/**
 * Functional component for editing a doctor's profile.
 * Fetches the doctor's data, allows editing and saving the profile details, including avatar.
 * Displays inputs for first name, last name, address, profile description, and avatar upload.
 * Handles file upload, updates the doctor object, and sends a PUT request to update the profile on the server.
 * Displays success or error messages accordingly.
 * Utilizes components for managing schedule, types of visits, leaves, specializations, and visits by the doctor.
 * Also allows doctors to change their password and permanently delete their account.
 */
export const EditDoctorProfilePage = (props: any) => {
    const { user, token } = useAuth();

    const [avatar, setAvatar] = useState<string | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Password change states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // Account deletion states
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchDoctor = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}doctors/${user?.id}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedDoctor: Doctor = new Doctor(
                responseJson.firstName,
                responseJson.lastName,
                responseJson.email,
                responseJson.role,
                responseJson.isVerified,
                responseJson.avatar,
                responseJson.profileDescription,
                responseJson.address,
                responseJson.id,
                responseJson.specializations,
                new Schedule(
                    responseJson.schedule?.mondayStart,
                    responseJson.schedule?.mondayEnd,
                    responseJson.schedule?.tuesdayStart,
                    responseJson.schedule?.tuesdayEnd,
                    responseJson.schedule?.wednesdayStart,
                    responseJson.schedule?.wednesdayEnd,
                    responseJson.schedule?.thursdayStart,
                    responseJson.schedule?.thursdayEnd,
                    responseJson.schedule?.fridayStart,
                    responseJson.schedule?.fridayEnd,
                    responseJson.schedule?.saturdayStart,
                    responseJson.schedule?.saturdayEnd,
                    responseJson.schedule?.sundayStart,
                    responseJson.schedule?.sundayEnd
                )
            );

            setDoctor(loadedDoctor);
            setIsLoading(false);
        };

        fetchDoctor().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message || "Something went wrong");
        });

    }, [success, user?.id]);

    const handleChangeDoctor = (e: any) => {
        setHttpError(null);
        setSuccess(null);

        const { name, value } = e.target;
        const tempDoctor = { ...doctor } as Doctor;

        if (tempDoctor) {
            switch (name) {
                case "firstName":
                    tempDoctor.firstName = value;
                    break;
                case "lastName":
                    tempDoctor.lastName = value;
                    break;
                case "country":
                    tempDoctor.address.country = value;
                    break;
                case "state":
                    tempDoctor.address.state = value;
                    break;
                case "city":
                    tempDoctor.address.city = value;
                    break;
                case "street":
                    tempDoctor.address.street = value;
                    break;
                case "houseNumber":
                    tempDoctor.address.houseNumber = value;
                    break;
                case "zipCode":
                    tempDoctor.address.zipCode = value;
                    break;
                case "profileDescription":
                    tempDoctor.profileDescription = value;
                    break;
                default:
                    break;
            }
            setDoctor(tempDoctor);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const bytes = new Uint8Array(arrayBuffer);
                const base64String = btoa(String.fromCharCode(...bytes));
                setAvatar(`data:image/png;base64,${base64String}`);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setSuccess(null);
        setHttpError(null);

        const tempDoctor = { ...doctor } as Doctor;
        if (tempDoctor && avatar) 
            tempDoctor.avatar = atob(avatar.split(",")[1]).split('').map(char => char.charCodeAt(0));

        try {
            const response = await fetch(`${process.env.REACT_APP_API}doctors/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(tempDoctor),
            });

            if (!response.ok) {
                setIsLoading(false);
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }

            setIsLoading(false);
            setSuccess("Profile updated successfully");

        } catch (error: any) {
            setIsLoading(false);
            setHttpError(error.message || 'Something went wrong');
        }
    };

    const submitPasswordChange = async () => {
        setPasswordError(null);
        setPasswordSuccess(null);

        if (newPassword !== confirmNewPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters long.");
            return;
        }

        setIsPasswordLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API}doctors/${user?.id}/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            setIsPasswordLoading(false);
            setPasswordSuccess("Password changed successfully.");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error: any) {
            setIsPasswordLoading(false);
            setPasswordError(error.message || 'Failed to change password');
        }
    };

    const submitDeleteAccount = async () => {
        setDeleteError(null);

        if (!window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
            return;
        }

        setIsDeleteLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API}doctors/${user?.id}/account?password=${encodeURIComponent(deletePassword)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete account');
            }

            // Successfully deleted, clear storage and redirect
            localStorage.removeItem('token');
            window.location.href = '/';
        } catch (error: any) {
            setIsDeleteLoading(false);
            setDeleteError(error.message || 'Failed to delete account');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                <div className="col-md-4 mb-5">
                    <div className="profile-avatar">
                        <div className="div-img">
                            {avatar ?
                                <img src={avatar} alt='avatar' className="img-fluid avatar-img" />
                                :
                                <img src={require('../../Images/avatar.png')} alt='avatar' className="img-fluid avatar-img" />
                            }
                        </div>
                        <input className="mt-3 form-control input-file" type="file" name="avatar" accept="image/jpeg, image/png" onChange={handleFileChange} />
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="profile-details">
                        First Name:
                        <input type="text" name="firstName" value={doctor?.firstName || ''} onChange={handleChangeDoctor} placeholder="First Name" className="form-control mb-2 mt-1" maxLength={100} />
                        Last Name:
                        <input type="text" name="lastName" value={doctor?.lastName || ''} onChange={handleChangeDoctor} placeholder="Last Name" className="form-control mb-2 mt-1" maxLength={100} />
                        <div className="address">
                            Country:
                            <input type="text" name="country" value={doctor?.address?.country || ''} onChange={handleChangeDoctor} placeholder="Country" className="form-control mb-2 mt-1" maxLength={100} />
                            State:
                            <input type="text" name="state" value={doctor?.address?.state || ''} onChange={handleChangeDoctor} placeholder="State" className="form-control mb-2 mt-1" maxLength={100} />
                            City:
                            <input type="text" name="city" value={doctor?.address?.city || ''} onChange={handleChangeDoctor} placeholder="City" className="form-control mb-2 mt-1" maxLength={100} />
                            Street:
                            <input type="text" name="street" value={doctor?.address?.street || ''} onChange={handleChangeDoctor} placeholder="Street" className="form-control mb-2 mt-1" maxLength={100} />
                            House Number:
                            <input type="text" name="houseNumber" value={doctor?.address?.houseNumber || ''} onChange={handleChangeDoctor} placeholder="House Number" className="form-control mb-2 mt-1" maxLength={10} />
                            Zip Code:
                            <input type="text" name="zipCode" value={doctor?.address?.zipCode || ''} onChange={handleChangeDoctor} placeholder="Zip Code" className="form-control mb-2 mt-1" maxLength={10} />
                        </div>
                        Profile Description:
                        <textarea name="profileDescription" value={doctor?.profileDescription || ''} onChange={handleChangeDoctor} placeholder="Profile Description" className="form-control mb-2 mt-1" rows={10} maxLength={10000}></textarea>
                        
                        <button onClick={handleSave} disabled={isLoading} className="btn my-btn m-3 mb-3">
                            {isLoading ? 'Saving...' : <>Save {<i className="bi bi-floppy"></i>}</>}
                        </button>
                        {httpError && <p className="text-danger">{httpError}</p>}
                        {success && <p className="text-success">{success}</p>}
                    </div>
                </div>
            </div>
            <br/><br/>
            <hr color="#FF0000"></hr>
            <ScheduleManagement schedule={doctor?.schedule} doctorId={user?.id} />
            <br/><br/><br/><br/>
            <hr color="#FF0000"></hr>
            <TypesOfVisitsManagement doctorId={user?.id} />
            <br/><br/><br/><br/>
            <hr color="#FF0000"></hr>
            <LeavesManagement doctorId={user?.id} />
            <br/><br/><br/><br/>
            <hr color="#FF0000"></hr>
            <SpecializationsManagement doctorId={user?.id} />
            <br/><br/><br/><br/>
            <hr color="#FF0000"></hr>
            <VisitsManagementByDoctor doctorId={user?.id} />

            <br/><br/><br/><br/>
            <hr color="#FF0000"></hr>
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <div className="profile-details">
                        <h4 className="mb-3">Change Password</h4>
                        <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="form-control mb-2 mt-1" />
                        <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-control mb-2 mt-1" />
                        <input type="password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="form-control mb-2 mt-1" />
                        
                        <button onClick={submitPasswordChange} disabled={isPasswordLoading || !currentPassword || !newPassword || !confirmNewPassword} className="btn my-btn m-3 mb-3">
                            {isPasswordLoading ? 'Changing...' : 'Change Password'}
                        </button>
                        {passwordError && <p className="text-danger">{passwordError}</p>}
                        {passwordSuccess && <p className="text-success">{passwordSuccess}</p>}
                    </div>
                </div>
            </div>

            <br/><br/>
            <hr color="#FF0000"></hr>
            <div className="row justify-content-center mt-5 mb-5">
                <div className="col-md-6">
                    <div className="profile-details">
                        <h4 className="mb-3 text-danger">Delete Account</h4>
                        <p>Once you delete your account, there is no going back. Please be certain.</p>
                        <input type="password" placeholder="Verify Password to Delete" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} className="form-control mb-2 mt-1" />
                        
                        <button onClick={submitDeleteAccount} disabled={isDeleteLoading || !deletePassword} className="btn btn-danger m-3 mb-3">
                            {isDeleteLoading ? 'Deleting...' : 'Delete Account'}
                        </button>
                        {deleteError && <p className="text-danger">{deleteError}</p>}
                    </div>
                </div>
            </div>
            
        </div>
    );
};