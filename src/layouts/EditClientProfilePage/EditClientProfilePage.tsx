import React, { useEffect, useState } from 'react';
import { Client } from '../../models/Client';
import { VisitsManagementByClient } from './components/VisitsManagementByClient';
import { useAuth } from '../../security/AuthContext';

export const EditClientProfilePage = () => {
    const { user } = useAuth();

    const [client, setClient] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        
        const fetchClient = async () => {
            const baseUrl: string = `http://localhost:8080/clients/${user?.id}`;

            const response = await fetch(baseUrl);

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

    }, [success, user?.id]);

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
            const response = await fetch(`http://localhost:8080/clients/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
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
                        {success && <p className="text">{success}</p>}
                    </div>
                </div>
            </div>
            <br/><br/>
            <hr color="#FF0000"></hr>
            <VisitsManagementByClient clientId={user?.id} />
            
        </div>
    );
};
