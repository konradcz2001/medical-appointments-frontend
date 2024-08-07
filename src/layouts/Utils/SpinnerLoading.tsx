

/**
 * Function component that renders a spinner loading animation.
 * 
 * @returns {JSX.Element} Spinner loading animation component
 */
export const SpinnerLoading = () => {
    return (
        <div className='container my-5 mx-auto d-flex justify-content-center' 
            style={{ height: 550 }}>
                <div className='spinner-border text-primary' role='status'>
                    <span className='visually-hidden'>
                        Loading...
                    </span>
                </div>
        </div>
    );
}