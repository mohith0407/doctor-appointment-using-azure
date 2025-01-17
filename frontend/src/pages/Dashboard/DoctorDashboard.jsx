import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchAppointments = async () => {
    try {
      console.log('Fetching with token:', token);
      const response = await axios.get('/api/users/appointments/doctor', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);
      setAppointments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error details:', error.response?.data);
      setError('Failed to fetch appointments');
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Refresh appointments list after status update
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setError('Failed to update appointment status');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Doctor Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Appointments</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {appointments.length === 0 ? (
        <p className="text-gray-600 text-center">No appointments found</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment.AppointmentID} className="p-6 bg-white shadow-md rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Patient: {appointment.PatientName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {appointment.PatientEmail}
                  </p>
                  <p className="text-sm text-gray-600">
                    Appointment Date: {new Date(appointment.AppointmentDate).toLocaleString()}
                  </p>
                  <p className={`text-sm font-medium ${
                    appointment.Status === 'ACCEPTED' ? 'text-green-600' :
                    appointment.Status === 'REJECTED' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    Status: {appointment.Status}
                  </p>
                </div>
                <div className="flex space-x-4">
                  {appointment.Status === 'PENDING' && (
                    <>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                        onClick={() => handleStatusUpdate(appointment.AppointmentID, 'ACCEPTED')}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                        onClick={() => handleStatusUpdate(appointment.AppointmentID, 'REJECTED')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DoctorDashboard;