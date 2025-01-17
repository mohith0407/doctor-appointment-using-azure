// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import PatientSignup from './pages/Signup/PatientSignup';
import DoctorSignup from './pages/Signup/DoctorSignUp';
import AdminSignup from './pages/Signup/AdminSignup';
import AdminLogin from './pages/Login/AdminLogin';
import DoctorLogin from './pages/Login/DoctorLogin';
import PatientLogin from './pages/Login/PatientLogin';
import BookAppointment from './pages/Patient/BookAppointment';

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/doctor" element={<DoctorLogin />} />
        <Route path="/login/patient" element={<PatientLogin />} />
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        {/* <Route path="/doctor/dashboard" element={<DoctorDashboard />} /> */}
        {/* <Route path="/patient/dashboard" element={<PatientDashboard />} /> */}
        <Route path="/signup/patient" element={<PatientSignup />} />
        <Route path="/signup/doctor" element={<DoctorSignup />} />
        <Route path="/signup/admin" element={<AdminSignup />} />
        {/* <Route path="/patient/book-appointment" element={<BookAppointment />} /> */}
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;