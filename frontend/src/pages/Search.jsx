import { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaSearch } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const Search = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  
  const [results, setResults] = useState({ events: [], announcements: [], clubs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        // We will fetch from multiple endpoints for a "Global Search" effect
        // In a real app, you'd have a single /api/search endpoint, but we can aggregate here
        
        const [eventsRes, annRes, clubsRes] = await Promise.all([
          fetch(`${API_URL}/events`, { headers: getAuthHeaders(token) }),
          fetch(`${API_URL}/announcements`, { headers: getAuthHeaders(token) }),
          fetch(`${API_URL}/clubs`, { headers: getAuthHeaders(token) })
        ]);

        const allEvents = eventsRes.ok ? await eventsRes.json() : [];
        const allAnn = annRes.ok ? await annRes.json() : [];
        const allClubs = clubsRes.ok ? await clubsRes.json() : [];

        const lowerQ = query.toLowerCase();

        setResults({
          events: allEvents.filter(e => e.title.toLowerCase().includes(lowerQ) || e.description.toLowerCase().includes(lowerQ)),
          announcements: allAnn.filter(a => a.title.toLowerCase().includes(lowerQ) || a.content.toLowerCase().includes(lowerQ)),
          clubs: allClubs.filter(c => c.name.toLowerCase().includes(lowerQ) || c.description.toLowerCase().includes(lowerQ))
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, token]);

  const totalResults = results.events.length + results.announcements.length + results.clubs.length;

  return (
    <div className="container">
      <div className="flex items-center gap-2 mb-6">
        <FaSearch size={24} color="var(--primary-color)" />
        <h2>Search Results for "{query}"</h2>
      </div>

      {loading ? <p>Searching...</p> : (
        <>
          <p className="mb-4 text-secondary">Found {totalResults} result(s)</p>
          
          {totalResults === 0 && (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <h3>No results found</h3>
              <p>Try using different keywords.</p>
            </div>
          )}

          {results.events.length > 0 && (
            <div className="mb-6">
              <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Events</h3>
              <div className="dashboard-grid">
                {results.events.map(event => (
                  <Link to="/events" key={event._id} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h4>{event.title}</h4>
                    <p style={{ fontSize: '0.9rem' }}>{event.category} • {new Date(event.date).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.announcements.length > 0 && (
            <div className="mb-6">
              <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Announcements</h3>
              <div className="dashboard-grid">
                {results.announcements.map(ann => (
                  <Link to="/announcements" key={ann._id} className="card" style={{ textDecoration: 'none', color: 'inherit', borderLeft: '4px solid var(--primary-color)' }}>
                    <h4>{ann.title}</h4>
                    <p style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ann.content}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.clubs.length > 0 && (
            <div className="mb-6">
              <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Clubs & Societies</h3>
              <div className="dashboard-grid">
                {results.clubs.map(club => (
                  <Link to="/clubs" key={club._id} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h4>{club.name}</h4>
                    <p style={{ fontSize: '0.9rem' }}>{club.category}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
