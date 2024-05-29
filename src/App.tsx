import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { DoctorProfilePage } from './layouts/DoctorProfilePage/DoctorProfilePage';
import { ReviewListPage } from './layouts/DoctorProfilePage/ReviewListPage/ReviewListPage';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchDoctorsPage } from './layouts/SearchDoctorsPage/SearchDoctorsPage';
import { LoginPage } from './layouts/LoginPage/LoginPage';
import { RegisterPage } from './layouts/RegisterPage/RegisterPage';
import { useEffect, useState } from 'react';
import { EditProfilePage } from './layouts/EditProfilePage/EditProfilePage';
import { ContactPage } from './layouts/ContactPage/ContactPage';
// import jwtDecode from 'jwt-decode';
// import jwt from 'jsonwebtoken';

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);
  // useEffect(() => {
  //   const token = localStorage.getItem('jwt');
  //   if (token) {
  //     try {
  //       const decodedToken = jwtDecode(token);
  //       const currentTime = Date.now() / 1000; // Czas w sekundach
  //       if (decodedToken.exp && decodedToken.exp > currentTime) {
  //         // Weryfikacja podpisu tokena
  //         const secret = 'your-256-bit-secret'; // Klucz tajny użyty do podpisania tokena
  //         jwt.verify(token, secret, (err: any, verifiedToken: any) => {
  //           if (err) {
  //             console.error('Token verification failed:', err);
  //             setIsLoggedIn(false);
  //           } else {
  //             // Możesz sprawdzić dodatkowe dane, takie jak uprawnienia
  //             console.log('Verified token:', verifiedToken);
  //             setIsLoggedIn(true);
  //           }
  //         });
  //       } else {
  //         localStorage.removeItem('jwt'); // Usunięcie wygasłego tokena
  //         setIsLoggedIn(false);
  //       }
  //     } catch (error) {
  //       console.error('Invalid token:', error);
  //       setIsLoggedIn(false);
  //     }
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, [setIsLoggedIn]);

console.log("isloged: " + isLoggedIn);

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className='flex-grow-1'>
        <Switch>
          <Route path='/' exact>
            <Redirect to='/home' />
          </Route>

          <Route path='/home'>
            <HomePage isLoggedIn={isLoggedIn} />
          </Route>

          <Route path='/login'>
            <LoginPage isLoggedIn={isLoggedIn} />
          </Route>

          <Route path='/register'>
            <RegisterPage isLoggedIn={isLoggedIn} />
          </Route>

          <Route path='/contact'>
            <ContactPage isLoggedIn={isLoggedIn} email={"email@email"} />
          </Route>

          <Route path='/profile'>
            <EditProfilePage isLoggedIn={isLoggedIn} email={"email@email"} />
          </Route>

          <Route path='/search'>
            <SearchDoctorsPage />
          </Route>

          <Route path='/doctor/:doctorId'>
            <DoctorProfilePage />
          </Route>

          <Route path='/reviewList/:doctorId'>
            <ReviewListPage />
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  );
}
