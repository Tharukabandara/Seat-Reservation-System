# 🪑 Seat Reservation System

<div align="center">

![Seat Reservation Banner](https://img.shields.io/badge/Seat-Reservation-blue?style=for-the-badge&logo=redux&logoColor=white)

**A modern, full-stack seat reservation system built with the MERN stack**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About The Project

The Seat Reservation System is a comprehensive web application designed for organizations to streamline their office seat booking process. Built with modern technologies and best practices, it provides an intuitive interface for both interns and administrators to manage workspace reservations efficiently.

### ✨ Key Highlights

- 🎨 **Modern UI/UX** - Clean, responsive design with smooth animations
- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- ⚡ **Real-time Updates** - Automatic status updates for past reservations
- 📱 **Mobile Responsive** - Works seamlessly on all device sizes
- 🛡️ **Data Validation** - Comprehensive validation rules to prevent conflicts
- 🎯 **Time Slot Management** - Support for morning, afternoon, and full-day bookings

---

## 🚀 Features

### For Interns
- ✅ Register and login with office email
- 📅 View available seats by date
- 🪑 Book seats for specific dates and time slots
- 📋 View current and past reservations
- ❌ Cancel future reservations
- 📊 Personal dashboard with reservation statistics

### For Administrators
- 👥 View all user reservations
- 🛠️ Add, edit, and delete seats
- 📈 Generate seat usage reports
- 🔍 Filter reservations by date or intern
- ⚙️ Manage seat status (available, unavailable, maintenance)
- 🎛️ Comprehensive admin dashboard

### Business Logic
- 🔒 One seat per intern per day
- ⏰ Seats must be booked at least 1 hour in advance
- 📧 Only valid office email addresses can register
- 🚫 Prevents double booking and overbooking
- ⏱️ Automatic status updates for expired reservations
- 🕐 Smart time slot management (morning/afternoon/full-day)

---

## 🛠️ Built With

### Frontend
- **React.js** - UI library for building user interfaces
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Context API** - State management
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt.js** - Password hashing

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas account)
- **Git**

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/seat-reservation-system.git
cd seat-reservation-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your `.env` file:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/seat-reservation

# JWT Secret (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# OR use MongoDB Atlas connection string in backend .env
```

### 5. Seed Initial Data (Optional)

```bash
# From backend directory
cd backend
node scripts/seedAdmin.js
```

This creates:
- Admin user: `admin@company.com` / `admin123`
- Sample intern: `john@company.com` / `intern123`
- Sample seats

---

## 🎯 Usage

### Starting the Application

**Backend Server:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Frontend Application:**
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### Default Login Credentials

**Admin Account:**
- Email: `admin@company.com`
- Password: `admin123`

**Intern Account:**
- Email: `john@company.com`
- Password: `intern123`

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Seat Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/seats` | Get available seats | Yes |
| GET | `/api/seats/admin/all` | Get all seats (admin) | Admin |
| POST | `/api/seats` | Create new seat | Admin |
| PUT | `/api/seats/:id` | Update seat | Admin |
| DELETE | `/api/seats/:id` | Delete seat | Admin |

### Reservation Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reservations/my` | Get user's reservations | Yes |
| GET | `/api/reservations/all` | Get all reservations | Admin |
| POST | `/api/reservations` | Create reservation | Yes |
| PUT | `/api/reservations/:id/cancel` | Cancel reservation | Yes |
| POST | `/api/reservations/update-statuses` | Update expired reservations | Admin |

### Request Examples

**Register User:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "securepassword"
}
```

**Create Reservation:**
```json
POST /api/reservations
Headers: { Authorization: "Bearer <token>" }
{
  "seatId": "60d5ec49f1b2c72b8c8e4f1a",
  "date": "2025-09-20",
  "timeSlot": "full-day"
}
```

---

## 📁 Project Structure

```
seat-reservation-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── seatController.js
│   │   └── reservationController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Seat.js
│   │   └── Reservation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── seats.js
│   │   └── reservations.js
│   ├── scripts/
│   │   └── seedAdmin.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Footer.js
│   │   │   │   └── LoadingSpinner.js
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.js
│   │   │   │   └── RegisterForm.js
│   │   │   └── seats/
│   │   │       ├── SeatGrid.js
│   │   │       └── SeatCard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── BookingPage.js
│   │   │   └── AdminPage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🔒 Security Features

- 🔐 JWT-based authentication
- 🔑 Password hashing with bcrypt
- 🛡️ Protected API routes
- ✅ Input validation and sanitization
- 🚫 CORS configuration
- 👥 Role-based access control (RBAC)

---

## 🌟 Future Enhancements

- [ ] Email notifications for bookings
- [ ] QR code check-in system
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] SMS reminders
- [ ] Advanced analytics and reporting
- [ ] Multi-branch support
- [ ] Seat preferences and favorites
- [ ] Real-time seat availability with WebSockets
- [ ] Mobile application (React Native)
- [ ] Export reports to PDF/Excel

---

## 🐛 Known Issues

- Time slot partial bookings currently treat entire day as unavailable (fix in progress)
- Mobile navigation can be improved
- Search functionality for admin panel needed

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Authors

**Your Name**
- GitHub: https://github.com/Tharukabandara
- LinkedIn: https://www.linkedin.com/in/tharuka-bandara-57b52b297
- Email: tharukabandara821@gmail.com

---

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Shields.io](https://shields.io/) for badges
- Inspiration from various seat booking systems

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

</div>
