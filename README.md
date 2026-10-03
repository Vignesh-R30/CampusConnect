# 🎓 CampusConnect

## 📖 Project Description
CampusConnect is a modern, unified smart campus platform built to bridge the gap between students, administration, and campus services. It serves as a central hub where students can manage their academic life, track events, participate in communities, and seamlessly interact with campus administrators in real-time.

## 🤔 Problem Statement
Traditional college campuses often rely on fragmented communication systems—ranging from physical notice boards and endless email threads to disjointed WhatsApp groups. This leads to information silos, missed academic announcements, inefficient complaint resolution, and a general lack of a unified digital campus community.

## 🎯 Objectives
- To digitize and centralize campus communication.
- To foster a vibrant digital community for students and faculty.
- To streamline administrative tasks such as event registrations, complaint tracking, and placement updates.
- To provide a modern, responsive, and highly accessible user interface across all devices.

## ✨ Features
- **Role-Based Access Control**: Secure login and registration with distinct Student and Admin roles (Admin registration protected by secret keys).
- **Interactive Dashboard**: A beautiful, responsive glassmorphism-themed dashboard summarizing upcoming events and important announcements.
- **Student Community**: Robust discussion forums for academics, programming, placements, and general campus life.
- **Event Management**: Browse, register, and track upcoming campus events seamlessly.
- **Lost & Found System**: Report lost items or find items with image uploads and category filtering.
- **Smart Complaint Portal**: File complaints with campus administration and track their resolution status.
- **Academic Resources**: Access study materials sorted by department and semester.
- **Admin Directory**: Admins can view a complete directory of registered students.
- **Profile Customization**: Users can upload native profile pictures and update their personal details.

## 💻 Technology Stack
- **Frontend**: React.js, Vite, React Router DOM, Custom Responsive Vanilla CSS, React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **File Uploads**: Multer (Local Storage)

## 🏗️ MERN Architecture
CampusConnect follows the robust MERN (MongoDB, Express.js, React.js, Node.js) stack architecture. 
- **Client Tier (React)**: Handles the UI rendering, routing, and global state (Context API) to provide a single-page application experience.
- **Server Tier (Express/Node)**: RESTful API backend handling business logic, authentications, and serving static uploaded files.
- **Data Tier (MongoDB)**: NoSQL database schemas modeling Users, Events, Announcements, Discussions, and Complaints for flexible and scalable storage.

## 📂 Folder Structure
```text
CampusConnect/
│
├── backend/                  # Express.js Server
│   ├── controllers/          # Route handlers & business logic
│   ├── middleware/           # JWT and role-based auth middleware
│   ├── models/               # Mongoose DB Schemas
│   ├── routes/               # API endpoint definitions
│   ├── uploads/              # Local storage for profile/post images
│   ├── .env.example          # Sample environment variables
│   └── server.js             # Entry point for backend
│
├── frontend/                 # React.js Client (Vite)
│   ├── public/               # Static assets
│   ├── src/                  
│   │   ├── assets/           # Images and static media
│   │   ├── components/       # Reusable UI components (Navbar, ProtectedRoute)
│   │   ├── context/          # Global state (AuthContext)
│   │   ├── pages/            # Main application views (Dashboard, Profile, etc.)
│   │   ├── services/         # API connection utilities
│   │   ├── App.jsx           # Main routing component
│   │   ├── index.css         # Global styles and responsive design
│   │   └── main.jsx          # React DOM renderer
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
├── .gitignore                # Global git ignores (node_modules, .env)
└── README.md                 # Project documentation
```

## 🛠️ Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vignesh-R30/CampusConnect.git
   cd CampusConnect
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## 🔐 Environment Variables
In the `backend` directory, rename `.env.example` to `.env` and fill in the values:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_SECRET_KEY=ADMIN123
```

## 🚀 How to Run Backend
Open a terminal in the `backend` directory and run:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

## 💻 How to Run Frontend
Open a new terminal in the `frontend` directory and run:
```bash
npm run dev
```
Vite will start the client, usually accessible at `http://localhost:5173`.

## 🌐 API Overview
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/api/auth/register` | Register new user/admin | No |
| POST   | `/api/auth/login` | Login user | No |
| GET    | `/api/auth/profile` | Get current user profile | Yes |
| PUT    | `/api/auth/profile` | Update profile / password | Yes |
| GET    | `/api/auth/users` | Admin fetches all students | Yes (Admin) |
| GET    | `/api/events` | Fetch all events | Yes |
| GET    | `/api/announcements`| Fetch all announcements | Yes |
| POST   | `/api/upload` | Upload image via Multer | Yes |

*(Note: Similar REST endpoints exist for Clubs, Discussions, Complaints, and Lost&Found).*

## 📸 Screenshots
*(Add screenshots of your application here!)*
- **Dashboard Overview**: `![Dashboard](link_to_image)`
- **Event Registration**: `![Events](link_to_image)`
- **Discussions Forum**: `![Community](link_to_image)`

## 🔮 Future Enhancements
- **Real-Time Chat**: Integrate Socket.io for live peer-to-peer messaging.
- **Push Notifications**: Implement web push notifications for critical announcements.
- **Mobile Application**: Port the responsive web app into a native React Native mobile app.
- **Cloud Storage**: Migrate local Multer uploads to AWS S3 or Cloudinary.

## 👥 Contributors
- **Vignesh R.S** - Full Stack Developer

---
*Built with ❤️ for a smarter campus.*
