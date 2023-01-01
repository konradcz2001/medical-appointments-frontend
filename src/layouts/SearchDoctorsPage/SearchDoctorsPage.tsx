import { useEffect, useState } from "react";
import { Doctor } from "../../models/Doctor";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchDoctor } from "./components/SearchDoctor";

export const SearchDoctorsPage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage, setDoctorsPerPage] = useState(5);
    const [totalAmountOfDoctors, setTotalAmountOfDoctors] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [specializationSelection, setSpecializationSelection] = useState('Specialization');


    useEffect(() => {
        const fetchDoctors = async () => {
            const baseUrl: string = "http://localhost:8080/doctors";
            let url: string = '';

            if(searchUrl === ''){
                url = `${baseUrl}?page=${currentPage - 1}&size=${doctorsPerPage}`;
            } else{
                url = baseUrl + searchUrl;
            }

            const response = await fetch(url);

            if(!response.ok){
                throw new Error("Something went wrong!");
            }

            const responseJson = await response.json();
            const responseData = responseJson.content;
            setTotalAmountOfDoctors(responseJson.totalElements);
            setTotalPages(responseJson.totalPages);
            const loadedDoctors: Doctor[] = [];

            for(const key in responseData){
                loadedDoctors.push(new Doctor(
                    responseData[key].id, 
                    responseData[key].firstName, 
                    responseData[key].lastName, 
                    responseData[key].email,
                    responseData[key].phoneNumber,
                    responseData[key].address.country,
                    responseData[key].address.state,
                    responseData[key].address.city,
                    responseData[key].address.street,
                    responseData[key].address.number,
                    responseData[key].address.zipCode,
                    responseData[key].isVerified,
                    responseData[key].avatar, 
                    responseData[key].profileDescription, 
                    responseData[key].specializations, 
                    responseData[key].leaves)
                );
            }

            setDoctors(loadedDoctors);
            setIsLoading(false);
        };
        fetchDoctors().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

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
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=0&size=${doctorsPerPage}`);
        }
    }

    const specializationField = (value: string) => {
        if (
            value.toLowerCase() === 'fe' || 
            value.toLowerCase() === 'be' || 
            value.toLowerCase() === 'data' || 
            value.toLowerCase() === 'devops'
        ) {
            setSpecializationSelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=0&size=${doctorsPerPage}`)
        } else {
            setSpecializationSelection('All');
            setSearchUrl(`?page=0&size=${doctorsPerPage}`)
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
                                <button className='btn btn-outline-success'
                                    onClick={() => searchHandleChange()}>
                                    Search
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
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li onClick={() => specializationField('All')}>
                                        <a className='dropdown-item' href='#'>
                                            All
                                        </a>
                                    </li>
                                    <li onClick={() => specializationField('FE')}>
                                        <a className='dropdown-item' href='#'>
                                            s1
                                        </a>
                                    </li>
                                    <li onClick={() => specializationField('BE')}>
                                        <a className='dropdown-item' href='#'>
                                            s2
                                        </a>
                                    </li>
                                    <li onClick={() => specializationField('Data')}>
                                        <a className='dropdown-item' href='#'>
                                            s3
                                        </a>
                                    </li>
                                    <li onClick={() => specializationField('DevOps')}>
                                        <a className='dropdown-item' href='#'>
                                            s4
                                        </a>
                                    </li>
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
                                <SearchDoctor doctor={doctor} key={doctor.id} />
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