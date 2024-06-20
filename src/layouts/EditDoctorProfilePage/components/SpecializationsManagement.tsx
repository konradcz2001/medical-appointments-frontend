import { Specialization } from "../../../models/Specialization";
import React, { useEffect, useState } from 'react';
import { Pagination } from '../../Utils/Pagination';
import { useAuth } from "../../../security/AuthContext";

/**
 * Functional component for managing doctor specializations.
 * Handles adding and removing specializations, pagination, and error handling.
 */
export const SpecializationsManagement= (props: any) => {

    const [doctorSpecializations, setDoctorSpecializations] = useState<Specialization[]>([]);
    const [allSpecializations, setAllSpecializations] = useState<Specialization[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [emptyPageError, setEmptyPageError] = useState<boolean>(false);
    const { token } = useAuth();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [specializationsPerPage] = useState(5);
    const [totalAmountOfSpecializations, setTotalAmountOfSpecializations] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        const fetchSpecializations = async () => {
            setHttpError(null);
            setEmptyPageError(false);

            const response = await fetch(`${process.env.REACT_APP_API}doctors/${props.doctorId}/specializations`);
            if (response.ok) {
                const loadedSpecializations: Specialization[] = await response.json();
                setDoctorSpecializations(loadedSpecializations);
            }
             else {
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }


            const responseAll = await fetch(`${process.env.REACT_APP_API}doctors/specializations?page=${currentPage - 1}&size=${specializationsPerPage}&sort=specialization`);
            if (responseAll.ok) {
                const responseJson = await responseAll.json();
                const responseData = responseJson.content;
                const loadedSpecializations: Specialization[] = [];

                setTotalAmountOfSpecializations(responseJson.totalElements);
                setTotalPages(responseJson.totalPages);

                for (const key in responseData) {

                    const loadedSpec: Specialization = {
                        specialization: responseData[key].specialization,
                        id: responseData[key].id
                    };
                    loadedSpecializations.push(loadedSpec);        
                }

                setAllSpecializations(loadedSpecializations);
            }
             else {
                const errorData: any = await responseAll.json();
                throw new Error(errorData.message);
            }
        };

        fetchSpecializations().catch((error: any) => {
            setIsLoading(false);
            if (error.message === "Page is empty") {
                setEmptyPageError(true);
            } else {
                setHttpError(error.message || "Something went wrong");
            }
        });


    }, [currentPage, props.doctorId, specializationsPerPage, success]);



    const handleAddSpecialization = async (specId: number | null) => {
        setHttpError(null);
        setSuccess(null);
        if (!specId) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API}doctors/${props.doctorId}/add-specializations`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify([specId]),
            });

            if (response.ok) {
                setSuccess("Specialization added successfully");
            } else {
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error: any) {
            setHttpError(error.message || 'Something went wrong');
          }
    };



    const handleRemoveSpecialization = async (specId: number | null) => {
        setSuccess(null);
        setHttpError(null);
        if (!specId) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API}doctors/${props.doctorId}/remove-specialization?id=${specId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                //setDoctorSpecializations(doctorSpecializations.filter(spec => spec.id !== specId));
                setSuccess("Specialization removed successfully");
            } else {
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error: any) {
            setHttpError(error.message || 'Something went wrong');
        }
    };



    const indexOfLastSpec: number = currentPage * specializationsPerPage;
    const indexOfFirstSpec: number = indexOfLastSpec - specializationsPerPage;

    let lastItem = specializationsPerPage * currentPage <= totalAmountOfSpecializations ? 
            specializationsPerPage * currentPage : totalAmountOfSpecializations;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);



    return (
            <>
            <div className="row mt-4">
            
                    <div className="mt-3 col-md-6 text-center">
                        <h4>Add Specialization</h4>
                        {emptyPageError ? <p className="text">There are no specializations to choose</p> : 
                        <p> {indexOfFirstSpec + 1} to {lastItem} of {totalAmountOfSpecializations} items: </p>}

                        {allSpecializations.map((spec, index) => (
                            <div key={index} className="mt-3">
                                <span>{spec.specialization + ' | '}</span>
                                <button onClick={() => handleAddSpecialization(spec.id)} className="btn my-btn"> <i className="bi bi-plus-lg"></i></button>
                            </div>
                        ))}

                        <div className='d-flex justify-content-center mt-3'>
                            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
                        </div>
                    </div>

                    <div className="mt-3 col-md-6 text-center">
                        <h4>Remove Specialization</h4>
                        {doctorSpecializations.length === 0 && <p className="text">You have no specializations yet</p>}


                        {doctorSpecializations.map((spec, index) => (
                            <div key={index} className="mt-3">
                                <span>{spec.specialization + ' | '}</span>
                                <button onClick={() => handleRemoveSpecialization(spec.id)} className="btn btn-trash"> <i className="bi bi-trash3"></i></button>
                            </div>
                        ))}

                    </div>

                    <div className='text-center mt-3'>
                        {httpError && <p className="text-danger">{httpError}</p>}
                        {success && <p className="text">{success}</p>}
                    </div>
                
            </div>
            </>
    );
}