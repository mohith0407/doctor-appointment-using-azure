require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./connectDB');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('express-rate-limit');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to the database
connectDB()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Enable CORS for Azure deployment
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Add Azure health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Ensure this matches the frontend request
app.use('/api/appointments', appointmentRoutes); // Ensure this matches the frontend request

// Use error handler
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Welcome to Smart Healthcare API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 