const express = require('express');
const router = express.Router();
const sql = require('mssql');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get all doctors
router.get('/', authenticateToken, roleCheck(['admin']), async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM Doctors');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new doctor
router.post('/', authenticateToken, roleCheck(['admin']), async (req, res) => {
  const { userId, specialty } = req.body;
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('specialty', sql.NVarChar, specialty)
      .query('INSERT INTO Doctors (UserID, Specialty) VALUES (@userId, @specialty)');
    res.status(201).send('Doctor added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get appointments for a specific doctor
router.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const pool = await sql.connect();

    // Use the UserID from the token to find the DoctorID
    const userId = req.user.userId;

    // Retrieve the DoctorID using the UserID
    const doctorResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT DoctorID FROM Doctors WHERE UserID = @userId');

    if (doctorResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const doctorId = doctorResult.recordset[0].DoctorID;

    // Retrieve appointments for the doctor
    const appointmentsResult = await pool.request()
      .input('doctorId', sql.Int, doctorId)
      .query('SELECT * FROM Appointments WHERE DoctorID = @doctorId');

    res.status(200).json(appointmentsResult.recordset);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 