import { useEffect, useState } from "react";
import { Doctor } from "../../models/Doctor";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchDoctor } from "./components/SearchDoctor";
import { Specialization } from "../../models/Specialization";
import { Address } from "../../models/Address";
import React from "react";

export const SearchDoctorsPage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [specializations, setSpecialization] = useState<Specialization[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(10);
    const [totalAmountOfDoctors, setTotalAmountOfDoctors] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [specializationSelection, setSpecializationSelection] = useState('Specialization');


    useEffect(() => {
        const fetchDoctors = async () => {
            const baseUrl: string = "http://localhost:8080/doctors";
            const pagination: string = `page=${currentPage - 1}&size=${doctorsPerPage}`;
            let url: string;

            if(searchUrl === '' && specializationSelection === 'Specialization'){
                url = `${baseUrl}?${pagination}&sort=firstName`;
            }
            else if(specializationSelection === 'Specialization'){
                url = `${baseUrl}${searchUrl}&${pagination}`;
                console.log(url);
            } 
            else if (searchUrl === ''){
                url = `${baseUrl}?specialization=${specializationSelection}&${pagination}`;
                console.log(url);
            }
            else{
                url = `${baseUrl}${searchUrl}&specialization=${specializationSelection}&${pagination}`;
            }

            const response = await fetch(url);

            if(!response.ok && response.status !== 404){
                throw new Error("Something went wrong!");
            }

            const responseJson = await response.json();
            const responseData = responseJson.content;
            setTotalAmountOfDoctors(responseJson.totalElements);
            setTotalPages(responseJson.totalPages);
            const loadedDoctors: Doctor[] = [];

            for (const key in responseData) {
            

                const loadedDoctor: Doctor = {

                    id: responseData[key].id,
                    firstName: responseData[key].firstName,
                    lastName: responseData[key].lastName,
                    email: responseData[key].email,
                    role: responseData[key].role,
                    address:{
                    country: responseData[key].address?.country,
                    state: responseData[key].address?.state,
                    city: responseData[key].address?.city,
                    street: responseData[key].address?.street,
                    houseNumber: responseData[key].address?.houseNumber,
                    zipCode: responseData[key].address?.zipCode
                    },
                    isVerified: responseData[key].isVerified,
                    avatar: responseData[key].avatar,
                    profileDescription: responseData[key].profileDescription,
                    specializations: responseData[key].specializations
    
                };

                loadedDoctors.push(loadedDoctor);
            }

            setDoctors(loadedDoctors);
            setIsLoading(false);
        };

        fetchDoctors().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });

        window.scrollTo(0, 0);
    }, [currentPage, doctorsPerPage, searchUrl, specializationSelection]);

    useEffect(() => {

        const fetchSpecializations = async () => {
            const url: string = "http://localhost:8080/doctors/specializations?sort=specialization";

            const response = await fetch(url);

            if(!response.ok && response.status !== 404){
                throw new Error("Something went wrong!");
            }

            const responseJson = await response.json();
            const responseData = responseJson.content;
            const loadedSpecializations: Specialization[] = [];

            for(const key in responseData){
                loadedSpecializations.push(new Specialization(
                    responseData[key].id, 
                    responseData[key].specialization)
                );
            }

            setSpecialization(loadedSpecializations);
            setIsLoading(false);
        };

        fetchSpecializations().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });


    }, []);

    if(isLoading){
        return(
            <SpinnerLoading/>
        )
    }

    if(httpError){
        return(
            <div className="container my-5 mx-auto d-flex justify-content-center">
                <p>{httpError}</p>
            </div>
        )
    }

    const searchHandleChange = () => {
        if(search === ''){
            setSearchUrl('');
        } else {
            setSearchUrl(`/search?word=${search}`);
        }
    }


    const indexOfLastDoctor: number = currentPage * doctorsPerPage;
    const indexOfFirstDoctor: number = indexOfLastDoctor - doctorsPerPage;
    let lastItem = doctorsPerPage * currentPage <= totalAmountOfDoctors ?
        doctorsPerPage * currentPage : totalAmountOfDoctors;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    return (
        <div>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input className='form-control me-2' type='search'
                                    placeholder='Search' aria-labelledby='Search'
                                    onChange={e => setSearch(e.target.value)} />
                                <button className='btn my-btn'
                                    onClick={() => searchHandleChange()}>
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                    aria-expanded='false'>
                                    {specializationSelection}
                                </button>
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1' style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <li onClick={() => setSpecializationSelection('Specialization')}>
                                        <a className='dropdown-item' href='#'>
                                            ALL
                                        </a>
                                    </li>
                                    {
                                    specializations.map(spec => {
                                        return(
                                            <li key={spec.id} onClick={() => setSpecializationSelection(spec.specialization.toLocaleUpperCase())}>
                                                <a className='dropdown-item' href='#'>
                                                {spec.specialization.toUpperCase()}
                                                </a>
                                            </li>
                                        );
                                    })
                                    }

                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfDoctors > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5>Number of results: ({totalAmountOfDoctors})</h5>
                            </div>
                            <p>
                                {indexOfFirstDoctor + 1} to {lastItem} of {totalAmountOfDoctors} items:
                            </p>
                            {doctors.map(doctor => (
                                <SearchDoctor doctor={doctor} searchTerm={search} key={doctor.id} />
                            ))}
                        </>
                        :
                        <div className='m-5'>
                            <h3>
                                No matching results found!
                            </h3>
                        </div>
                    }
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    );
}