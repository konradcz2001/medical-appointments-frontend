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

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);



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
