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

async function createTables() {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // SQL queries to create tables
    const createUsersTable = `
      CREATE TABLE Users (
        UserID INT PRIMARY KEY IDENTITY(1,1),
        FullName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        Role NVARCHAR(50) NOT NULL,
        PhoneNumber NVARCHAR(15)
      );
    `;

    const createDoctorsTable = `
      CREATE TABLE Doctors (
        DoctorID INT PRIMARY KEY IDENTITY(1,1),
        UserID INT FOREIGN KEY REFERENCES Users(UserID),
        Specialization NVARCHAR(100) NOT NULL
      );
    `;

    const createAppointmentsTable = `
      CREATE TABLE Appointments (
        AppointmentID INT PRIMARY KEY IDENTITY(1,1),
        PatientID INT FOREIGN KEY REFERENCES Users(UserID),
        DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID),
        AppointmentDate DATETIME NOT NULL,
        Status NVARCHAR(50) NOT NULL
      );
    `;

    // Execute the queries in order
    await pool.request().query(createUsersTable);
    console.log('Users table created successfully.');

    await pool.request().query(createDoctorsTable);
    console.log('Doctors table created successfully.');

    await pool.request().query(createAppointmentsTable);
    console.log('Appointments table created successfully.');

    // Close the connection
    await pool.close();
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

// Run the function to create the tables
createTables();
