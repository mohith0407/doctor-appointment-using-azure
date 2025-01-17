const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const logger = require('../logger');
const auth = require('../middleware/auth');

const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('patient', 'doctor', 'admin').required(),
  phoneNumber: Joi.string().optional(),
  specialization: Joi.string().optional(),
});

// Register a new user
router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { fullName, email, password, role, specialization } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await sql.connect();

    // Insert user into the Users table
    const userResult = await pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('email', sql.NVarChar, email)
      .input('passwordHash', sql.NVarChar, hashedPassword)
      .input('role', sql.NVarChar, role)
      .query('INSERT INTO Users (FullName, Email, PasswordHash, Role) OUTPUT INSERTED.UserID VALUES (@fullName, @email, @passwordHash, @role)');

    const userId = userResult.recordset[0].UserID;

    // If the user is a doctor, insert into the Doctors table
    if (role === 'doctor') {
      await pool.request()
        .input('userId', sql.Int, userId)
        .input('specialization', sql.NVarChar, specialization)
        .query('INSERT INTO Doctors (UserID, Specialization) VALUES (@userId, @specialization)');
    }

    logger.info('User registered successfully');
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Server error');
  }
});

// Update the doctor appointments route
router.get('/appointments/doctor', auth, async (req, res) => {
  try {
    console.log('Received request for doctor appointments');
    console.log('User from token:', req.user);
    
    const pool = await sql.connect();

    // First get the DoctorID for this user
    const doctorResult = await pool.request()
      .input('userId', sql.Int, req.user.UserID)
      .query(`
        SELECT DoctorID 
        FROM Doctors 
        WHERE UserID = @userId
      `);

    if (doctorResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorId = doctorResult.recordset[0].DoctorID;
    console.log('Found DoctorID:', doctorId);

    // Then get the appointments using DoctorID
    const appointmentsResult = await pool.request()
      .input('doctorId', sql.Int, doctorId)
      .query(`
        SELECT 
          a.AppointmentID,
          a.PatientID,
          a.AppointmentDate,
          a.Status,
          u.FullName as PatientName,
          u.Email as PatientEmail
        FROM Appointments a
        JOIN Users u ON a.PatientID = u.UserID
        WHERE a.DoctorID = @doctorId
        ORDER BY a.AppointmentDate DESC
      `);
    
    console.log('Found appointments:', appointmentsResult.recordset);
    res.json(appointmentsResult.recordset);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get patient appointments
router.get('/appointments/patient', auth, async (req, res) => {
  try {
    console.log('User from token:', req.user);
    
    const pool = await sql.connect();
    const result = await pool.request()
      .input('patientId', sql.Int, req.user.UserID)
      .query(`
        SELECT 
          a.AppointmentID,
          a.AppointmentDate,
          a.Status,
          d.DoctorID,
          u.FullName as DoctorName,
          u.Email as DoctorEmail,
          d.Specialization
        FROM Appointments a
        JOIN Doctors d ON a.DoctorID = d.DoctorID
        JOIN Users u ON d.UserID = u.UserID
        WHERE a.PatientID = @patientId
        ORDER BY a.AppointmentDate DESC
      `);
    
    console.log('Found appointments:', result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

module.exports = router; 