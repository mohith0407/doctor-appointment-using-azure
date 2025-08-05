# 🩺 DoctMent - Doctor Appointment Management System

DoctMent is a **full-stack doctor appointment management application** that enables users to book appointments, doctors to manage schedules, and admins to oversee the platform.  
Built with **Node.js (Express)** for the backend and **React (Vite + Tailwind CSS)** for the frontend.

---

## 📂 Project Structure
```plaintext
## 📂 Project Structure

DoctMent/
│
├── backend/                        # Backend API (Node.js + Express)
│   ├── .azure/                      # Azure deployment configurations
│   ├── config.yml                   # Backend config file
│   ├── .github/workflows/           # GitHub Actions CI/CD workflows
│
│   ├── functions/                   # Azure Functions for async processing
│   ├── AppointmentNotifications/    # Appointment notification handlers
│   ├── ProcessAppointment/          # Appointment processing logic
│   ├── ProcessAppointmentNotifications/  # Processing appointment notifications
│   ├── ProcessAppointmentQueue/     # Queue processing for appointments
│   ├── ProcessNotifications/        # General notification processing
│
│   ├── middleware/                  # Express middlewares
│
│   ├── routes/                      # API routes
│   │   ├── adminRoutes.js           # Admin-specific routes
│   │   ├── appointmentRoutes.js     # Appointment-related routes
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── doctorRoutes.js          # Doctor-related routes
│   │   └── userRoutes.js            # User-related routes
│
│   ├── test/                        # Backend test cases
│
│   ├── utils/                       # Utility functions/services
│   │   ├── emailService.js          # Email sending logic
│   │   └── queueService.js          # Azure queue handling
│
│   ├── .env.example                 # Example environment variables
│   ├── connectDB.js                 # MongoDB connection setup
│   ├── dbConfig.js                  # Database configuration
│   ├── logger.js                    # Logging service
│   ├── server.js                    # Express app entry point
│   ├── package.json                 # Backend dependencies & scripts
│   └── ...                          # Other backend files
│
└── frontend/                        # Frontend UI (React + Vite)
    ├── src/
    │   ├── assets/                  # Static assets (images, icons)
    │   ├── components/              # Reusable UI components
    │   ├── context/                 # Context API state management
    │   ├── pages/                   # Page components
    │   ├── styles/                  # Tailwind/global styles
    │   ├── utils/                   # Helper functions
    │   ├── App.jsx                  # Main app component
    │   ├── main.jsx                 # React entry point
    │   └── index.css                # Global styles
    ├── package.json                 # Frontend dependencies & scripts
    └── ...                          # Other frontend files

```

---

## 🚀 Features

- **User Authentication** (JWT-based)
- **Role Management** (Admin, Doctor, Patient)
- **Appointment Booking & Scheduling**
- **Email Notifications** for confirmations and reminders
- **Real-time Queue Processing** (Azure Functions + Queue)
- **Admin Dashboard** for managing users and appointments
- **Responsive UI** with Tailwind CSS

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Context API

**Backend:**
- Node.js + Express
- MongoDB / Azure SQL (depending on configuration)
- Azure Functions for async processing
- Nodemailer for email notifications

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/doctment.git
cd doctment
2️⃣ Backend Setup
cd backend
npm install
cp .env.example .env   # Configure environment variables
npm run dev            # Start in development mode
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev            # Start Vite development server
📬 Environment Variables
Backend (backend/.env):
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
Frontend (frontend/.env):

VITE_API_URL=http://localhost:5000/api
📜 Scripts
Backend:

npm run dev – Start in development mode

npm start – Start in production mode

Frontend:

npm run dev – Start local dev server

npm run build – Build production-ready files

npm run preview – Preview production build
