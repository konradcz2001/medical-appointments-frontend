import React, { useEffect, useState } from 'react';
import { Pagination } from '../../Utils/Pagination';
import { Visit } from "../../../models/Visit";

export const VisitsManagementByDoctor = (props: any) => {

    const [doctorVisits, setDoctorVisits] = useState<Visit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [emptyPageError, setEmptyPageError] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [visitsPerPage] = useState(5);
    const [totalAmountOfVisits, setTotalAmountOfVisits] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchVisits = async () => {
            setHttpError(null);
            setEmptyPageError(false);

            try {
                const response = await fetch(`http://localhost:8080/visits?isCancelled=false&doctorId=${props.doctorId}&page=${currentPage - 1}&size=${visitsPerPage}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }

                const responseJson = await response.json();
                const responseData = responseJson.content;
                const loadedVisits: Visit[] = [];

                setTotalAmountOfVisits(responseJson.totalElements);
                setTotalPages(responseJson.totalPages);

                for (const visitData of responseData) {
                    const responseClient = await fetch(`http://localhost:8080/clients/${visitData.clientId}`);
                    if (!responseClient.ok) {
                        const errorData = await responseClient.json();
                        throw new Error(errorData.message);
                    }

                    const responseJsonClient = await responseClient.json();

                    const visit: Visit = {
                        id: visitData.id,
                        date: visitData.date,
                        type: visitData.typeOfVisit.type,
                        price: visitData.typeOfVisit.price,
                        currency: visitData.typeOfVisit.currency,
                        duration: visitData.typeOfVisit.duration,
                        isCancelled: visitData.isCancelled,
                        doctorId: visitData.typeOfVisit.doctorId,
                        clientId: visitData.clientId,
                        clientFirstName: responseJsonClient.firstName,
                        clientLastName: responseJsonClient.lastName,
                        notes: visitData.notes
                    };
                    loadedVisits.push(visit);
                }

                setDoctorVisits(loadedVisits);
                setIsLoading(false);

            } catch (error: any) {
                setIsLoading(false);
                if (error.message === "Page is empty") {
                    setEmptyPageError(true);
                } else {
                    setHttpError(error.message || "Something went wrong");
                }
            }
        };

        fetchVisits();
    }, [currentPage, props.doctorId, visitsPerPage, success]);

    const handleCancelVisit = async (visitId: number) => {
        setSuccess(null);
        setHttpError(null);

        try {
            const response = await fetch(`http://localhost:8080/visits/${visitId}`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            setDoctorVisits(prevVisits => prevVisits.filter(visit => visit.id !== visitId));
            setTotalAmountOfVisits(prevTotal => prevTotal - 1);
            setSuccess("Visit cancelled successfully");
            

        } catch (error: any) {
            setHttpError(error.message || 'Something went wrong');
        }
    };

    const indexOfLastVisit: number = currentPage * visitsPerPage;
    const indexOfFirstVisit: number = indexOfLastVisit - visitsPerPage;

    let lastItem = visitsPerPage * currentPage <= totalAmountOfVisits ? 
    visitsPerPage * currentPage : totalAmountOfVisits;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="row mt-4">
                <div className="mt-3 col-md-12 text-center">
                    <h4>My Visits</h4>
                    {emptyPageError ? <p className="text">You have no visits yet</p> : 
                    <p> 
                        {indexOfFirstVisit + 1} to {lastItem} of {totalAmountOfVisits} items: 
                    </p>}

                    {doctorVisits.map((visit) => (
                        <div key={visit.id} className="mt-3">
                            <span>
                                <strong>Date:</strong> {visit.date.toLocaleString().substring(0, visit.date.toLocaleString().length - 3)} | <strong>Type:</strong> {visit.type} | <strong>Price:</strong> {visit.price}{visit.currency} | <strong>Duration:</strong> {visit.duration} minutes | <strong>Notes:</strong> {visit.notes}{ !visit.notes && ' - '} | <strong>Client:</strong> {visit.clientFirstName} {visit.clientLastName} |&nbsp;
                            </span>

                            <button onClick={() => handleCancelVisit(visit.id)} className="btn btn-trash">Cancel</button>
                        </div>
                    ))}

                    <div className='d-flex justify-content-center mt-3'>
                        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
                    </div>
                </div>

                <div className='text-center mt-3'>
                    {httpError && <p className="text-danger">{httpError}</p>}
                    {success && <p className="text">{success}</p>}
                </div>
            </div>
        </>
    );
};
