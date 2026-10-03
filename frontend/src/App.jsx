import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Complaints from './pages/Complaints';
import LostFound from './pages/LostFound';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import Clubs from './pages/Clubs';
import Discussions from './pages/Discussions';
import Academics from './pages/Academics';
import Placements from './pages/Placements';
import Search from './pages/Search';
import StudentsDirectory from './pages/StudentsDirectory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/complaints" 
            element={
              <ProtectedRoute>
                <Complaints />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lost-found" 
            element={
              <ProtectedRoute>
                <LostFound />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/announcements" 
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/clubs" 
            element={
              <ProtectedRoute>
                <Clubs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/discussions" 
            element={
              <ProtectedRoute>
                <Discussions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/academics" 
            element={
              <ProtectedRoute>
                <Academics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/placements" 
            element={
              <ProtectedRoute>
                <Placements />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students" 
            element={
              <ProtectedRoute>
                <StudentsDirectory />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
