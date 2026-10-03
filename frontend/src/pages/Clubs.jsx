import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUsers, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const Clubs = () => {
  const { user, token } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('members-desc');

  // Admin form
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Technical', establishedYear: new Date().getFullYear(), coverImage: '' });
  const [showForm, setShowForm] = useState(false);

  const fetchClubs = async () => {
    try {
      const res = await fetch(`${API_URL}/clubs`, { headers: getAuthHeaders(token) });
      if (res.ok) setClubs(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/clubs`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ name: '', description: '', category: 'Technical', establishedYear: new Date().getFullYear(), coverImage: '' });
        setShowForm(false);
        fetchClubs();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create club');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinLeave = async (id, action) => {
    try {
      const res = await fetch(`${API_URL}/clubs/${id}/${action}`, {
        method: 'POST',
        headers: getAuthHeaders(token)
      });
      const data = await res.json();
      if (res.ok) {
        fetchClubs();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaUsers size={28} color="var(--primary-color)" />
          <h2 style={{ margin: 0 }}>Campus Clubs & Societies</h2>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex items-center gap-2">
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> New Club</>}
          </button>
        )}
      </div>

      {showForm && user?.role === 'admin' && (
        <div className="card mb-6" style={{ borderTop: '4px solid var(--primary-color)' }}>
          <h3>Register New Club</h3>
          <form onSubmit={handleCreate} className="mt-4">
            <div className="flex gap-4 mb-4">
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Club Name</label>
                <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Category</label>
                <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Literary">Literary</option>
                  <option value="Social">Social</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Established Year</label>
                <input type="number" className="form-input" value={formData.establishedYear} onChange={e => setFormData({...formData, establishedYear: e.target.value})} required />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Cover Image URL</label>
                <input type="url" className="form-input" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description & Mission</label>
              <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Create Club</button>
          </form>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <input 
          type="text" 
          placeholder="Search clubs by name or category..." 
          className="form-input" 
          style={{ flex: 2 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select 
          className="form-input" 
          style={{ flex: 1 }}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="members-desc">Members: High to Low</option>
          <option value="members-asc">Members: Low to High</option>
          <option value="year-desc">Est. Year: Newest</option>
          <option value="year-asc">Est. Year: Oldest</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>

      {loading ? <p>Loading clubs...</p> : (
        <div className="dashboard-grid">
          {clubs.filter(club => {
            const q = searchQuery.toLowerCase();
            return club.name.toLowerCase().includes(q) || club.category.toLowerCase().includes(q);
          }).sort((a, b) => {
            if (sortOption === 'members-desc') return b.members.length - a.members.length;
            if (sortOption === 'members-asc') return a.members.length - b.members.length;
            if (sortOption === 'year-desc') return b.establishedYear - a.establishedYear;
            if (sortOption === 'year-asc') return a.establishedYear - b.establishedYear;
            if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
            return 0;
          }).map(club => {
            const isMember = club.members.some(m => m._id === user._id);
            const isPresident = club.president._id === user._id;

            return (
              <div key={club._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img src={club.coverImage || 'https://via.placeholder.com/400x200?text=Campus+Club'} alt={club.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{club.name}</h4>
                    <span style={{ fontSize: '0.7rem', backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>{club.category}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Est. {club.establishedYear} • President: {club.president.name}</p>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{club.description}</p>
                  
                  <div className="flex items-center justify-between border-t pt-3 mt-auto" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <FaUsers /> {club.members.length} Members
                    </div>
                    
                    {isPresident ? (
                      <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.85rem' }}>★ President</span>
                    ) : isMember ? (
                      <button onClick={() => handleJoinLeave(club._id, 'leave')} className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>
                        Leave
                      </button>
                    ) : (
                      <button onClick={() => handleJoinLeave(club._id, 'join')} className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', backgroundColor: '#10b981' }}>
                        Join Club
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {clubs.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No clubs registered yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Clubs;
