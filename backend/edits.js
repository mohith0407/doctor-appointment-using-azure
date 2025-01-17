// healthcare-backend/edits.js
require('dotenv').config();
const sql = require('mssql');

// Configuration for your database connection using environment variables
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

async function clearPatientsData() {
  try {
    const pool = await sql.connect(config);
    
    // First check the current number of patients
    const beforeCount = await pool.request()
      .query('SELECT COUNT(*) as count FROM Users WHERE Role = \'patient\'');
    console.log('Current number of patients:', beforeCount.recordset[0].count);
    
    // Delete patient records
    console.log('Deleting patient records...');
    const deleteResult = await pool.request()
      .query('DELETE FROM Users WHERE Role = \'patient\'');
    
    console.log('Patient records deleted successfully');

    // Verify patients are deleted
    const afterCount = await pool.request()
      .query('SELECT COUNT(*) as count FROM Users WHERE Role = \'patient\'');
    console.log('Number of patients after clearing:', afterCount.recordset[0].count);

    await pool.close();
  } catch (err) {
    console.error('Error clearing patient data:', err);
  }
}

// Run the function to clear the data
clearPatientsData();