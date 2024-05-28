
export const AboutUs = () => {
    return (
        <div className="m-auto about-us-container">
            <div className='d-none d-lg-block'>
                <div className='row g-0 mt-5'>
                    <div className='col-sm-6 col-md-6'>
                        <img src={require('../../../Images/doctors.png')}  alt='doctors' className="img-fluid"></img>
                    </div>
                    <div className='col-4 col-md-4 container d-flex justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>Who are you looking for?</h1>
                            <p className='lead'>
                                On our website you will find a doctor suitable for your needs, 
                                specializing in a given field of medicine. You can narrow your search by the location you are interested in. 
                                Some doctors offer home visits, which you will find out about in their profiles. 
                                If necessary, you can always ask your doctor a question in private chat.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='row g-0'>
                    <div className='col-4 col-md-4 container d-flex 
                        justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>Can you trust our doctors?</h1>
                            <p className='lead'>
                                The website has a rating system. Clients can leave an opinion on a given specialist. 
                                In addition, if the doctor has some documents confirming his skills, he can verify himself. 
                                Our team checks the credibility of documents. Successful verification will be confirmed 
                                by the verification stamp <i className="bi bi-patch-check"></i> placed next to the doctor's name.
                            </p>
                        </div>
                    </div>
                    <div className='col-sm-6 col-md-6'>
                        <img src={require('../../../Images/verification.jpg')}  alt='verification' className="img-fluid"></img>
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div className='d-lg-none'>
                <div className='container'>
                    <div className='m-2'>
                        <img src={require('../../../Images/doctors.png')}  alt='doctors' className="img-fluid"></img>
                        <div className='mt-2'>
                            <h1>Who are you looking for?</h1>
                            <p className='lead'>
                                On our website you will find a doctor suitable for your needs, 
                                specializing in a given field of medicine. You can narrow your search by the location you are interested in. 
                                Some doctors offer home visits, which you will find out about in their profiles. 
                                If necessary, you can always ask your doctor a question in private chat.
                            </p>
                        </div>
                    </div>
                    <div className='m-2'>
                        <img src={require('../../../Images/verification.jpg')}  alt='verification' className="img-fluid"></img>
                        <div className='mt-2'>
                            <h1>Can you trust our doctors?</h1>
                            <p className='lead'>
                                The website has a rating system. Clients can leave an opinion on a given specialist. 
                                In addition, if the doctor has some documents confirming his skills, he can verify himself. 
                                Our team checks the credibility of documents. Successful verification will be confirmed 
                                by the verification stamp placed next to the doctor's profile.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}