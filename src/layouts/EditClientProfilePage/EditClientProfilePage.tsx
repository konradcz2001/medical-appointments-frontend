import React, { useEffect, useState } from 'react';
import { Client } from '../../models/Client';
import { VisitsManagementByClient } from './components/VisitsManagementByClient';
import { useAuth } from '../../security/AuthContext';

/**
 * EditClientProfilePage component for managing client profile details.
 * Fetches client data, allows editing first and last name, and saves changes.
 * Displays loading state, success message, and error message accordingly.
 * Also allows users to change their password and permanently delete their account.
 */
export const EditClientProfilePage = () => {
    const { user, token } = useAuth();

    const [client, setClient] = useState<Client | null>(null);
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
        
        const fetchClient = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}clients/${user?.id}`;

            const response = await fetch(baseUrl, {
                method: 'GET', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedClient: Client = {
                id: responseJson.id,
                firstName: responseJson.firstName,
                lastName: responseJson.lastName,
                email: responseJson.email,
                role: responseJson.role
            };

            setClient(loadedClient);
            setIsLoading(false);

        };

        fetchClient().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message || "Something went wrong");
        });

    }, [success, token, user?.id]);

    const handleChangeClient = (e: any) => {
        setHttpError(null);
        setSuccess(null);

        const { name, value } = e.target;
        const tempClient = { ...client } as Client;

        if (tempClient) {
            switch (name) {
                case "firstName":
                    tempClient.firstName = value;
                    break;
                case "lastName":
                    tempClient.lastName = value;
                    break;
                default:
                    break;
            }
            setClient(tempClient);
        }
    };



    const handleSave = async () => {
        setIsLoading(true);
        setSuccess(null);
        setHttpError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API}clients/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(client),
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
            const response = await fetch(`${process.env.REACT_APP_API}clients/${user?.id}/password`, {
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
            const response = await fetch(`${process.env.REACT_APP_API}clients/${user?.id}/account?password=${encodeURIComponent(deletePassword)}`, {
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
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="profile-details">
                        First Name:
                        <input type="text" name="firstName" value={client?.firstName || ''} onChange={handleChangeClient} placeholder="First Name" className="form-control mb-2 mt-1" maxLength={100} />
                        Last Name:
                        <input type="text" name="lastName" value={client?.lastName || ''} onChange={handleChangeClient} placeholder="Last Name" className="form-control mb-2 mt-1" maxLength={100} />
                        
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
            <VisitsManagementByClient clientId={user?.id} />

            <br/><br/>
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