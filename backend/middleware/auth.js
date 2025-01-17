const jwt = require('jsonwebtoken');
const sql = require('mssql');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database with role
    const pool = await sql.connect();
    const result = await pool.request()
      .input('userId', sql.Int, decoded.userId)
      .query('SELECT UserID, FullName, Email, Role FROM Users WHERE UserID = @userId');

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object with role
    req.user = result.recordset[0];
    console.log('Auth middleware - User:', req.user);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 