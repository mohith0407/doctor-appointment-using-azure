const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

const connectDB = async () => {
  try {
    console.log('Attempting to connect to SQL Server...');
    await sql.connect(config);
    console.log('✅ Database connection successful!');
    console.log(`Connected to database: ${process.env.DB_NAME}`);
    console.log(`Server: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    console.error('Error details:', {
      code: err.code,
      message: err.message,
      serverName: process.env.DB_HOST,
      database: process.env.DB_NAME
    });
    process.exit(1);
  }
};

module.exports = connectDB;
