import React, { useEffect, useState, useContext } from 'react';
import axios from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/appointments/doctors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        alert('Failed to fetch doctors. Please try again later.');
      }
    };

    fetchDoctors();
  }, [token]);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate) {
      alert('Please select a doctor and an appointment date.');
      return;
    }

    try {
      const response = await axios.post('/api/appointments/book', {
        doctorId: selectedDoctor,
        appointmentDate,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Appointment booked successfully');
      setAppointmentDate('');
      setSelectedDoctor('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(`Failed to book appointment: ${error.response.data}`);
      } else if (error.request) {
        // Request was made but no response received
        alert('No response from server. Please try again later.');
      } else {
        // Something else happened
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Book an Appointment</h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="doctor">
          Select a Doctor
        </label>
        <select
          id="doctor"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.DoctorID} value={doctor.DoctorID}>
              {doctor.FullName} - {doctor.Specialization}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="appointmentDate">
          Appointment Date
        </label>
        <input
          type="datetime-local"
          id="appointmentDate"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleBookAppointment}
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default BookAppointment;
