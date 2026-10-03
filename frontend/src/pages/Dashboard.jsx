import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaBullhorn, FaClipboardList, FaSearchLocation, FaUsers, FaComments, FaBookOpen, FaBriefcase, FaUserGraduate, FaSearch } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [announcements, setAnnouncements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const token = user?.token || localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/announcements?category=Important', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data.slice(0, 3)); // show top 3
        }

        const eventsRes = await fetch('http://localhost:5000/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setUpcomingEvents(eventsData.slice(0, 2)); // show top 2 events
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchLatest();
  }, [user]);

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="container">
      <div className="mb-8" style={{ 
        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', 
        color: 'white', 
        padding: '3rem 2rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome back, {user?.name}! 👋</h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem' }}>Here's an overview of your campus activities. What would you like to do today?</p>
          
          <form onSubmit={handleSearch} style={{ 
            display: 'flex', 
            background: 'rgba(255, 255, 255, 0.15)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '2rem', 
            padding: '0.4rem', 
            maxWidth: '600px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center' }}>
              <FaSearch color="white" />
            </div>
            <input 
              type="text" 
              placeholder="Search for events, announcements, clubs..." 
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: 'white', fontSize: '1.05rem' }} 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="placeholder-white"
            />
            <button type="submit" className="btn" style={{ borderRadius: '2rem', padding: '0.6rem 1.8rem', backgroundColor: 'white', color: '#4f46e5', fontWeight: 'bold' }}>
              Search
            </button>
          </form>
        </div>
        {/* Decorative background circle */}
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
      </div>

      <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 500px' }}>
          <h3 className="mb-4" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Quick Actions</h3>
          <div className="dashboard-grid">
            <Link to="/events" className="action-card text-center text-decoration-none">
              <div style={{ color: '#4f46e5', marginBottom: '0.75rem' }}><FaCalendarAlt size={32} /></div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Explore Events</h4>
            </Link>
            <Link to="/announcements" className="action-card text-center text-decoration-none">
              <div style={{ color: '#ec4899', marginBottom: '0.75rem' }}><FaBullhorn size={32} /></div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Announcements</h4>
            </Link>
            <Link to="/complaints" className="action-card text-center text-decoration-none">
              <div style={{ color: '#f59e0b', marginBottom: '0.75rem' }}><FaClipboardList size={32} /></div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Complaints</h4>
            </Link>
            <Link to="/lost-found" className="action-card text-center text-decoration-none">
              <div style={{ color: '#06b6d4', marginBottom: '0.75rem' }}><FaSearchLocation size={32} /></div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Lost & Found</h4>
            </Link>
            <Link to="/clubs" className="action-card text-center text-decoration-none">
              <div style={{ color: '#8b5cf6', marginBottom: '0.75rem' }}><FaUsers size={32} /></div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Browse Clubs</h4>
            </Link>
            <Link to="/discussions" className="action-card text-center text-decoration-none">
              <div style={{ color: '#10b981', marginBottom: '0.75rem' }}><FaComments size={32} /></div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Discussions</h4>
            </Link>
            <Link to="/academics" className="action-card text-center text-decoration-none">
              <div style={{ color: '#6366f1', marginBottom: '0.75rem' }}><FaBookOpen size={32} /></div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Digital Library</h4>
            </Link>
            <Link to="/placements" className="action-card text-center text-decoration-none">
              <div style={{ color: '#059669', marginBottom: '0.75rem' }}><FaBriefcase size={32} /></div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Placements</h4>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/students" className="action-card text-center text-decoration-none" style={{ border: '2px dashed #ef4444' }}>
                <div style={{ color: '#ef4444', marginBottom: '0.75rem' }}><FaUserGraduate size={32} /></div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Students Directory</h4>
              </Link>
            )}
          </div>
        </div>

        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Mini Profile Widget */}
          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(to right bottom, #ffffff, #f8fafc)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={user?.profilePicture?.startsWith('/uploads') ? `http://localhost:5000${user.profilePicture}` : (user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`)} 
                alt="Profile" 
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user?.name}</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', backgroundColor: '#e0e7ff', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>{user?.role === 'admin' ? 'Administrator' : 'Student'}</span>
              </div>
            </div>
            <Link to="/profile" className="btn btn-outline w-full" style={{ justifyContent: 'center' }}>View Full Profile</Link>
          </div>

          {/* Important Announcements */}
          <div>
            <h3 className="mb-4" style={{ fontSize: '1.3rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaBullhorn color="#ec4899" /> Announcements</h3>
            <div className="flex flex-col gap-3">
              {announcements.length > 0 ? announcements.map(ann => (
                <div key={ann._id} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #ec4899', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{ann.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ann.content}</p>
                </div>
              )) : (
                <p style={{ color: 'var(--text-secondary)' }}>No important announcements right now.</p>
              )}
              <Link to="/announcements" style={{ fontSize: '0.875rem', color: '#ec4899', textAlign: 'center', display: 'block', marginTop: '0.5rem' }}>View all announcements &rarr;</Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h3 className="mb-4" style={{ fontSize: '1.3rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCalendarAlt color="#4f46e5" /> Upcoming Events</h3>
            <div className="flex flex-col gap-3">
              {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                <div key={event._id} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #4f46e5', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{event.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>📍 {event.location}</span>
                  </div>
                </div>
              )) : (
                <p style={{ color: 'var(--text-secondary)' }}>No upcoming events.</p>
              )}
              <Link to="/events" style={{ fontSize: '0.875rem', color: '#4f46e5', textAlign: 'center', display: 'block', marginTop: '0.5rem' }}>View all events &rarr;</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

