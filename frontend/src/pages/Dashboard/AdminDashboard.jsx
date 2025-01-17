import React, { useEffect, useState, useContext } from 'react';
import axios from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Admin token:', token);
        
        const [patientsRes, doctorsRes] = await Promise.all([
          axios.get('/api/admin/patients', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/admin/doctors', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
        setError('');
      } catch (error) {
        console.error('Dashboard error:', error);
        setError(error.response?.data?.message || 'Failed to fetch data');
        if (error.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        }
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Patients</h2>
          {patients.length > 0 ? (
            <ul className="space-y-2">
              {patients.map(patient => (
                <li key={patient.UserID} className="p-3 bg-gray-50 rounded">
                  <p className="font-medium">{patient.FullName}</p>
                  <p className="text-sm text-gray-600">{patient.Email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No patients found</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Doctors</h2>
          {doctors.length > 0 ? (
            <ul className="space-y-2">
              {doctors.map(doctor => (
                <li key={doctor.UserID} className="p-3 bg-gray-50 rounded">
                  <p className="font-medium">{doctor.FullName}</p>
                  <p className="text-sm text-gray-600">{doctor.Specialization}</p>
                  <p className="text-sm text-gray-600">{doctor.Email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No doctors found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;