// healthcare-backend/createDoctorAppointmentsTable.js
require('dotenv').config(); // Load environment variables from .env file
const sql = require('mssql');

// Log the server to verify it's being read correctly
console.log('DB_HOST:', process.env.DB_HOST);

// Configuration for your database connection using environment variables
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST, // Use DB_HOST for the server
  database: process.env.DB_NAME, // Use DB_NAME for the database
  options: {
    encrypt: true, // Use this if you're on Azure
    trustServerCertificate: false, // Set to false for Azure
  },
};

async function createDoctorAppointmentsTable() {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // SQL query to create the DoctorAppointments table
    const createDoctorAppointmentsTableQuery = `
      CREATE TABLE DoctorAppointments (
        DoctorAppointmentID INT PRIMARY KEY IDENTITY(1,1),
        DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
        AppointmentID INT FOREIGN KEY REFERENCES Appointments(AppointmentID)
      );
    `;

    // Execute the query
    await pool.request().query(createDoctorAppointmentsTableQuery);
    console.log('DoctorAppointments table created successfully.');

    // Close the connection
    await pool.close();
  } catch (err) {
    console.error('Error creating DoctorAppointments table:', err);
  }
}

// Run the function to create the table
createDoctorAppointmentsTable();