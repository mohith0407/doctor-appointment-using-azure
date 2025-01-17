const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT UserID, FullName, Email, PasswordHash, Role FROM Users WHERE Email = @email');

    const user = result.recordset[0];
    console.log('User from DB:', user);

    if (!user) return res.status(401).send('Invalid email or password');

    const validPassword = await bcrypt.compare(password, user.PasswordHash);
    if (!validPassword) return res.status(401).send('Invalid email or password');

    const token = jwt.sign({ userId: user.UserID, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
