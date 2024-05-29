import React, { useEffect, useState } from 'react';
import { Doctor } from '../../models/Doctor';

export const EditProfilePage = (props: any) => {
    const doctorId = 2;

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [profileDescription, setProfileDescription] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [houseNumber, setHouseNumber] = useState<string>("");
    const [zipCode, setZipCode] = useState<string>("");
    const [avatar, setAvatar] = useState<string | null>(null); // Change to string

    const [doctor, setDoctor] = useState<Doctor>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            const baseUrl: string = `http://localhost:8080/doctors/${doctorId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedDoctor: Doctor = {
                id: responseJson.id,
                firstName: responseJson.firstName,
                lastName: responseJson.lastName,
                email: responseJson.email,
                role: responseJson.role,
                address: {
                    country: responseJson.address.country,
                    state: responseJson.address.state,
                    city: responseJson.address.city,
                    street: responseJson.address.street,
                    houseNumber: responseJson.address.houseNumber,
                    zipCode: responseJson.address.zipCode
                },
                isVerified: responseJson.isVerified,
                avatar: responseJson.avatar,
                profileDescription: responseJson.profileDescription,
                specializations: responseJson.specializations
            };

            setFirstName(loadedDoctor.firstName || "");
            setLastName(loadedDoctor.lastName || "");
            setProfileDescription(loadedDoctor.profileDescription || "");
            setCountry(loadedDoctor.address.country || "");
            setState(loadedDoctor.address.state || "");
            setCity(loadedDoctor.address.city || "");
            setStreet(loadedDoctor.address.street || "");
            setHouseNumber(loadedDoctor.address.houseNumber || "");
            setZipCode(loadedDoctor.address.zipCode || "");
            setAvatar(loadedDoctor.avatar || null)

            if (loadedDoctor.avatar) {
                setAvatar(`data:image/png;base64,${loadedDoctor.avatar}`);
            } else {
                setAvatar(null);
            }

            setDoctor(loadedDoctor);
            setIsLoading(false);
        };
        fetchDoctor().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, [setSuccess]);

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

        const toSendDoctor: Doctor = {
            firstName: firstName,
            lastName: lastName,
            address: {
                country: country,
                state: state,
                city: city,
                street: street,
                houseNumber: houseNumber,
                zipCode: zipCode
            },
            avatar: avatar ? atob(avatar.split(",")[1]).split('').map(char => char.charCodeAt(0)) : null, // Convert base64 string back to byte array
            profileDescription: profileDescription
        };

        console.log('Saving doctor data:', toSendDoctor); // Log doctor data before sending

        setDoctor(toSendDoctor);

        try {
            const response = await fetch(`http://localhost:8080/doctors/${doctorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(toSendDoctor),
            });

            if (!response.ok) {
                setIsLoading(false);
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }

            setIsLoading(false);
            setSuccess("Profile updated successfully");

            setDoctor(doctor);
        } catch (error: any) {
            setIsLoading(false);
            setHttpError(error.message || 'Something went wrong');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                <div className="col-md-4 mb-5">
                    <div className="profile-avatar">
                        <div className=" div-img">
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
                        <input type="text" name="firstName" value={firstName || ""} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className="form-control mb-2 mt-1" maxLength={100}/>
                        Last Name:
                        <input type="text" name="lastName" value={lastName || ""} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="form-control mb-2 mt-1" maxLength={100}/>
                        <div className="address">
                            Country:
                            <input type="text" name="country" value={country || ""} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="form-control mb-2 mt-1" maxLength={100}/>
                            State:
                            <input type="text" name="state" value={state || ""} onChange={(e) => setState(e.target.value)} placeholder="State" className="form-control mb-2 mt-1" maxLength={100}/>
                            City:
                            <input type="text" name="city" value={city || ""} onChange={(e) => setCity(e.target.value)} placeholder="City" className="form-control mb-2 mt-1" maxLength={100}/>
                            Street:
                            <input type="text" name="street" value={street || ""} onChange={(e) => setStreet(e.target.value)} placeholder="Street" className="form-control mb-2 mt-1" maxLength={100}/>
                            House Number:
                            <input type="text" name="houseNumber" value={houseNumber || ""} onChange={(e) => setHouseNumber(e.target.value)} placeholder="House Number" className="form-control mb-2 mt-1" maxLength={10}/>
                            Zip Code:
                            <input type="text" name="zipCode" value={zipCode || ""} onChange={(e) => setZipCode(e.target.value)} placeholder="Zip Code" className="form-control mb-2 mt-1" maxLength={10}/>
                        </div>
                        Profile Description:
                        <textarea name="profileDescription" value={profileDescription || ""} onChange={(e) => setProfileDescription(e.target.value)} placeholder="Profile Description" className="form-control mb-2 mt-1" rows={10} maxLength={10000}></textarea>
                        
                        <button onClick={handleSave} disabled={isLoading} className="btn my-btn m-3">
                        {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        {httpError && <p className="text-danger">{httpError}</p>}
                        {success && <p className="text">{success}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};


