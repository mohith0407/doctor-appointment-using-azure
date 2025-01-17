import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-blue-600 text-white p-4 flex justify-between">
    <Link to="/" className="text-2xl font-bold">Smart Healthcare</Link>
    <div>
      <Link to="/login/admin" className="px-4">Admin Login</Link>
      <Link to="/login/doctor" className="px-4">Doctor Login</Link>
      <Link to="/login/patient" className="px-4">Patient Login</Link>
    </div>
  </nav>
);

export default Navbar;
