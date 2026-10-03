import { Link } from 'react-router-dom';
import { FaBullhorn, FaSearch, FaCalendarAlt } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to CampusConnect</h1>
        <p>Your centralized hub for reporting issues, finding lost items, and staying updated with campus events.</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-outline">Login</Link>
        </div>
      </div>

      <div className="dashboard-grid mt-4">
        <div className="card text-center">
          <div className="flex justify-center mb-4 text-primary">
            <FaBullhorn size={48} color="#4f46e5" />
          </div>
          <h3>Report Issues</h3>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
            Quickly report maintenance or academic issues and track their resolution status.
          </p>
        </div>
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <FaSearch size={48} color="#10b981" />
          </div>
          <h3>Lost & Found</h3>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
            Lost something? Found something? Connect with your peers to return belongings.
          </p>
        </div>
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <FaCalendarAlt size={48} color="#f59e0b" />
          </div>
          <h3>Campus Events</h3>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
            Stay in the loop with upcoming seminars, fests, and workshops on campus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
