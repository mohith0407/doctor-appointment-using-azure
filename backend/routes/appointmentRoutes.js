const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../middleware/auth');
const { addToQueue } = require('../utils/queueService');

// Get available doctors
router.get('/doctors', auth, async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .query(`
        SELECT 
          d.DoctorID,
          u.FullName,
          d.Specialization
        FROM Doctors d
        JOIN Users u ON d.UserID = u.UserID
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).send('Server error');
  }
});

// Book an appointment
router.post('/book', auth, async (req, res) => {
  try {
    console.log('Booking appointment with data:', req.body);
    console.log('User from token:', req.user);

    const { doctorId, appointmentDate } = req.body;
    const patientId = req.user.UserID;

    const pool = await sql.connect();
    
    try {
      // Get doctor's details
      const doctorResult = await pool.request()
        .input('doctorId', sql.Int, doctorId)
        .query(`
          SELECT u.Email, u.FullName
          FROM Users u
          JOIN Doctors d ON u.UserID = d.UserID
          WHERE d.DoctorID = @doctorId
        `);

      const doctorEmail = doctorResult.recordset[0].Email;
      const doctorName = doctorResult.recordset[0].FullName;

      // Insert appointment
      const appointmentResult = await pool.request()
        .input('patientId', sql.Int, patientId)
        .input('doctorId', sql.Int, doctorId)
        .input('appointmentDate', sql.DateTime, new Date(appointmentDate))
        .input('status', sql.NVarChar, 'PENDING')
        .query(`
          INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate, Status)
          OUTPUT INSERTED.AppointmentID
          VALUES (@patientId, @doctorId, @appointmentDate, @status)
        `);

      const appointmentId = appointmentResult.recordset[0].AppointmentID;
      
      console.log('Sending notification for new appointment');
      const queueMessage = {
        type: 'NEW_APPOINTMENT',
        appointmentId: appointmentId,
        doctorEmail: doctorEmail,
        doctorName: doctorName,
        patientName: req.user.FullName,
        appointmentDate: appointmentDate
      };
      console.log('Queue message:', queueMessage);
      await addToQueue(queueMessage);
      console.log('Notification queued for new appointment');

      res.status(201).json({ 
        message: 'Appointment booked successfully',
        appointmentId: appointmentId 
      });
    } catch (err) {
      console.error('Error in appointment booking:', err);
      res.status(500).json({ message: 'Error booking appointment' });
    }
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ 
      message: 'Error booking appointment',
      error: err.message 
    });
  }
});

// Update appointment status
router.put('/:appointmentId/status', auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const pool = await sql.connect();
    
    // Get appointment details with patient and doctor info
    const appointmentDetails = await pool.request()
      .input('appointmentId', sql.Int, appointmentId)
      .query(`
        SELECT 
          a.*,
          p.Email as PatientEmail,
          p.FullName as PatientName,
          d.FullName as DoctorName
        FROM Appointments a
        JOIN Users p ON a.PatientID = p.UserID
        JOIN Doctors doc ON a.DoctorID = doc.DoctorID
        JOIN Users d ON doc.UserID = d.UserID
        WHERE a.AppointmentID = @appointmentId
      `);

    const appointment = appointmentDetails.recordset[0];

    // Update status
    await pool.request()
      .input('appointmentId', sql.Int, appointmentId)
      .input('status', sql.NVarChar, status)
      .query('UPDATE Appointments SET Status = @status WHERE AppointmentID = @appointmentId');

    console.log('Sending notification for status update');
    const queueMessage = {
      type: 'STATUS_UPDATE',
      appointmentId: appointmentId,
      patientEmail: appointment.PatientEmail,
      patientName: appointment.PatientName,
      doctorName: appointment.DoctorName,
      status: status,
      appointmentDate: appointment.AppointmentDate
    };
    console.log('Queue message:', queueMessage);
    await addToQueue(queueMessage);
    console.log('Notification queued for status update');

    res.json({ 
      message: 'Status updated successfully',
      appointment: appointmentDetails.recordset[0]
    });
  } catch (err) {
    console.error('Error in status update:', err);
    res.status(500).json({ message: 'Error updating status' });
  }
});

module.exports = router;
