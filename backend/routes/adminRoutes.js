const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.Role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all patients - protected route
router.get('/patients', auth, isAdmin, async (req, res) => {
  try {
    console.log('Fetching patients. User role:', req.user.Role);
    const pool = await sql.connect();
    const result = await pool.request()
      .query(`
        SELECT UserID, FullName, Email, PhoneNumber 
        FROM Users 
        WHERE Role = 'patient'
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Get all doctors - protected route
router.get('/doctors', auth, isAdmin, async (req, res) => {
  try {
    console.log('Fetching doctors. User role:', req.user.Role);
    const pool = await sql.connect();
    const result = await pool.request()
      .query(`
        SELECT 
          u.UserID,
          u.FullName,
          u.Email,
          u.PhoneNumber,
          d.Specialization,
          d.DoctorID
        FROM Users u
        JOIN Doctors d ON u.UserID = d.UserID
        WHERE u.Role = 'doctor'
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Add a new doctor - protected route
router.post('/doctors', auth, isAdmin, async (req, res) => {
  try {
    const { userId, specialization } = req.body;
    const pool = await sql.connect();
    
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('specialization', sql.NVarChar, specialization)
      .query(`
        INSERT INTO Doctors (UserID, Specialization)
        VALUES (@userId, @specialization)
      `);
    
    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (err) {
    console.error('Error adding doctor:', err);
    res.status(500).json({ message: 'Error adding doctor' });
  }
});

// Remove a doctor - protected route
router.delete('/doctors/:doctorId', auth, isAdmin, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const pool = await sql.connect();
    
    await pool.request()
      .input('doctorId', sql.Int, doctorId)
      .query('DELETE FROM Doctors WHERE DoctorID = @doctorId');
    
    res.json({ message: 'Doctor removed successfully' });
  } catch (err) {
    console.error('Error removing doctor:', err);
    res.status(500).json({ message: 'Error removing doctor' });
  }
});

module.exports = router;
