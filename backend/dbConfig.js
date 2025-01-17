require('dotenv').config(); // Ensure this is at the top of the file

const dbConfig = {
    server: process.env.DB_HOST,       // Use environment variable
    user: process.env.DB_USER,         // Use environment variable
    password: process.env.DB_PASSWORD, // Use environment variable
    database: process.env.DB_NAME,     // Use environment variable
    options: {
        encrypt: true,                 // Use this if you're on Azure
        trustServerCertificate: true   // Change to true for local dev / self-signed certs
    },
    connectionTimeout: 30000, // 30 seconds
    requestTimeout: 30000 // 30 seconds
};

module.exports = dbConfig;
