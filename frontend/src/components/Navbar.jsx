import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaGraduationCap, FaUserCircle, FaSignOutAlt, FaBell, FaSearch } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && token) {
      const fetchNotifications = async () => {
        try {
          const res = await fetch(`${API_URL}/notifications`, { headers: getAuthHeaders(token) });
          if (res.ok) setNotifications(await res.json());
        } catch (err) {
          console.error(err);
        }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
      return () => clearInterval(interval);
    }
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/read`, { method: 'PUT', headers: getAuthHeaders(token) });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={user ? '/dashboard' : '/'} className="nav-logo">
          <FaGraduationCap /> CampusConnect
        </Link>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <>
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'var(--background-color)', padding: '0.3rem 0.8rem', borderRadius: '2rem' }}>
                <FaSearch color="var(--text-secondary)" />
                <input 
                  type="text" 
                  placeholder="Search campus..." 
                  style={{ border: 'none', background: 'transparent', outline: 'none', padding: '0.3rem 0.5rem', width: '200px', color: '#1f2937' }} 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </form>

              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications && unreadCount > 0) markNotificationsAsRead();
                  }} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
                >
                  <FaBell size={20} color="var(--text-color)" />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '1rem', fontWeight: 'bold' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="card" style={{ position: 'absolute', top: '150%', right: '0', width: '300px', padding: '0', zIndex: 1000, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: '400px', overflowY: 'auto' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <h4 style={{ margin: 0 }}>Notifications</h4>
                    </div>
                    <div>
                      {notifications.length > 0 ? notifications.map(notif => (
                        <div key={notif._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: notif.isRead ? 'white' : '#f1f5f9' }}>
                          <h5 style={{ margin: '0 0 0.25rem 0' }}>{notif.title}</h5>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{notif.message}</p>
                        </div>
                      )) : (
                        <p style={{ padding: '1rem', margin: 0, textAlign: 'center', color: 'var(--text-secondary)' }}>No notifications</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/profile" className="nav-link flex items-center gap-2">
                <FaUserCircle /> {user.name}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
