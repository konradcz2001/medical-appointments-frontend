import React, { useEffect, useState } from 'react';
import { Pagination } from '../../Utils/Pagination';
import { TypeOfVisit } from '../../../models/TypeOfVisit';
import { useAuth } from '../../../security/AuthContext';

/**
 * Component for managing types of visits for a doctor.
 * Handles adding and removing types of visits, pagination, and error handling.
 */
export const TypesOfVisitsManagement = (props: any) => {
    const [doctorTypesOfVisits, setDoctorTypesOfVisits] = useState<TypeOfVisit[]>([]);
    const [newTypeOfVisit, setNewTypeOfVisit] = useState<TypeOfVisit>(new TypeOfVisit(0, '', '0', '', 0, true, props.doctorId));
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [emptyPageError, setEmptyPageError] = useState<boolean>(false);
    const { token } = useAuth();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [typesOfVisitsPerPage] = useState(5);
    const [totalAmountOfTypesOfVisits, setTotalAmountOfTypesOfVisits] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchTypesOfVisits = async () => {
            setHttpError(null);
            setEmptyPageError(false);

            try {
                const response = await fetch(`${process.env.REACT_APP_API}doctors/${props.doctorId}/types-of-visits?page=${currentPage - 1}&size=${typesOfVisitsPerPage}&sort=type`);
                if (response.ok) {
                    const responseJson = await response.json();
                    const responseData = responseJson.content;

                    setTotalAmountOfTypesOfVisits(responseJson.totalElements);
                    setTotalPages(responseJson.totalPages);

                    const loadedTypesOfVisits: TypeOfVisit[] = responseData.map((type: any) => ({
                        type: type.type,
                        id: type.id,
                        price: type.price,
                        currency: type.currency,
                        duration: type.duration,
                        isActive: type.isActive,
                        doctorId: type.doctorId
                    }));

                    setDoctorTypesOfVisits(loadedTypesOfVisits);
                } else {
                    const errorData: any = await response.json();
                    throw new Error(errorData.message);
                }
            } catch (error) {
                setIsLoading(false);
                if (error instanceof Error) {
                    if (error.message === "Page is empty") {
                        setEmptyPageError(true);
                    } else {
                        setHttpError(error.message || "Something went wrong");
                    }
                } else {
                    setHttpError("Something went wrong");
                }
            }
        };

        fetchTypesOfVisits();
    }, [currentPage, props.doctorId, typesOfVisitsPerPage, success]);

    const handleAddTypeOfVisit = async () => {
        setHttpError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API}doctors/${props.doctorId}/add-type-of-visit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newTypeOfVisit),
            });

            if (response.ok) {
                setSuccess("Type of visit added successfully");
                setNewTypeOfVisit(new TypeOfVisit(0, '', '0', '', 0, true, props.doctorId));
                setCurrentPage(1); // Reset page to 1 to reflect new addition
            } else {
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                setHttpError(error.message || 'Something went wrong');
            } else {
                setHttpError("Something went wrong");
            }
        }
    };

    const handleRemoveTypeOfVisit = async (typeId: number | null) => {
        setSuccess(null);
        setHttpError(null);
        if (!typeId) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API}doctors/${props.doctorId}/remove-type-of-visit?id=${typeId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setSuccess("Type of visit removed successfully");
                setDoctorTypesOfVisits(doctorTypesOfVisits.filter(type => type.id !== typeId));
            } else {
                const errorData: any = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                setHttpError(error.message || 'Something went wrong');
            } else {
                setHttpError("Something went wrong");
            }
        }
    };

    const indexOfLastType = currentPage * typesOfVisitsPerPage;
    const indexOfFirstType = indexOfLastType - typesOfVisitsPerPage;
    let lastItem = typesOfVisitsPerPage * currentPage <= totalAmountOfTypesOfVisits ? typesOfVisitsPerPage * currentPage : totalAmountOfTypesOfVisits;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewTypeOfVisit(prevState => ({
            ...prevState,
            [name]: name === 'duration' ? Number(value) : value
        }));
    };

    return (
        <>
            <div className="row mt-4">
                <div className="mt-3 col-md-6 text-center">
                    <h4>Add Type of Visit</h4>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddTypeOfVisit(); }}>
                        <div className="form-group">
                            <label>Type</label>
                            <input type="text" name="type" value={newTypeOfVisit.type} onChange={handleInputChange} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="number" name="price" value={newTypeOfVisit.price} onChange={handleInputChange} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label>Currency</label>
                            <input type="text" name="currency" value={newTypeOfVisit.currency} onChange={handleInputChange} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label>Duration (minutes)</label>
                            <input type="number" name="duration" value={newTypeOfVisit.duration} onChange={handleInputChange} className="form-control" required />
                        </div>
                        <button type="submit" className="btn my-btn mt-3">Add Type of Visit</button>
                    </form>
                </div>
                <div className="mt-3 col-md-6 text-center">
                    <h4>Remove Type of Visit</h4>
                    {emptyPageError ? 
                        <p className="text">You have no types of visits yet</p> :
                    <p>
                        {indexOfFirstType + 1} to {lastItem} of {totalAmountOfTypesOfVisits} items:
                    </p>}
                    {doctorTypesOfVisits.map(type => (
                        <div key={type.id} className="mt-3">
                            <span>{type.type} ({type.duration} minutes) - {type.price}{type.currency} | </span>
                            <button onClick={() => handleRemoveTypeOfVisit(type.id)} className="btn btn-trash"> <i className="bi bi-trash3"></i></button>
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
