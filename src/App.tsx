import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { DoctorProfilePage } from './layouts/DoctorProfilePage/DoctorProfilePage';
import { ReviewListPage } from './layouts/DoctorProfilePage/ReviewListPage/ReviewListPage';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchDoctorsPage } from './layouts/SearchDoctorsPage/SearchDoctorsPage';
import { LoginPage } from './layouts/LoginPage/LoginPage';
import { RegisterPage } from './layouts/RegisterPage/RegisterPage';
import { ContactPage } from './layouts/ContactPage/ContactPage';
import { EditDoctorProfilePage } from './layouts/EditDoctorProfilePage/EditDoctorProfilePage';
import { EditClientProfilePage } from './layouts/EditClientProfilePage/EditClientProfilePage';
import { AuthProvider } from './security/AuthContext';
import PrivateRoute from './security/PrivateRoute';
import PublicRoute from './security/PublicRoute';

export const App = () => {
  return (
    <AuthProvider>
      <div className='d-flex flex-column min-vh-100'>
        <Navbar />
        <div className='flex-grow-1'>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
            <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />
            <Route path="/contact" element={<PrivateRoute element={<ContactPage />} />} />
            <Route path="/doctor-profile" element={<PrivateRoute element={<EditDoctorProfilePage />} />} />
            <Route path="/client-profile" element={<PrivateRoute element={<EditClientProfilePage />} />} />
            <Route path="/search" element={<SearchDoctorsPage />} />
            <Route path="/doctor/:doctorId" element={<DoctorProfilePage />} />
            <Route path="/review-list/:doctorId" element={<ReviewListPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
};
