import React, { useEffect, useState, useContext } from 'react';
import axios from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!token) return;
      try {
        const response = await axios.get('/api/appointments/doctors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to fetch doctors');
      }
    };

    const fetchAppointments = async () => {
      if (!token) return;
      try {
        console.log('Fetching patient appointments with token:', token);
        const response = await axios.get('/api/users/appointments/patient', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        console.log('Patient appointments response:', response.data);
        setAppointments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to fetch appointments');
        setAppointments([]);
      }
    };

    fetchDoctors();
    fetchAppointments();
  }, [token]);

  const handleBookAppointment = () => {
    navigate('/patient/book-appointment');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'text-green-600';
      case 'REJECTED':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Patient Dashboard</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Doctors</h2>
        {doctors.length === 0 ? (
          <p className="text-gray-600 text-center">No doctors available</p>
        ) : (
          <ul className="space-y-2">
            {doctors.map((doctor) => (
              <li key={doctor.DoctorID} className="p-4 bg-gray-100 rounded-md shadow-sm">
                {doctor.FullName} - {doctor.Specialization}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-600 text-center">No appointments found</p>
        ) : (
          <ul className="space-y-2">
            {appointments.map((appointment) => (
              <li key={appointment.AppointmentID} className="p-4 bg-gray-100 rounded-md shadow-sm">
                <p className="font-medium">Doctor: {appointment.DoctorName}</p>
                <p className="text-sm text-gray-600">Specialization: {appointment.Specialization}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(appointment.AppointmentDate).toLocaleString()}
                </p>
                <p className={`text-sm font-medium ${getStatusColor(appointment.Status)}`}>
                  Status: {appointment.Status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        onClick={handleBookAppointment}
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
      >
        Book a New Appointment
      </button>
    </div>
  );
};

export default PatientDashboard;
