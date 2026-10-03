import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBullhorn, FaThumbtack, FaTrash, FaCheckCircle } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const Announcements = () => {
  const { user, token } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [readIds, setReadIds] = useState(new Set());
  const [expandedIds, setExpandedIds] = useState(new Set());
  
  // Admin form state
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General', isPinned: false });

  const fetchAnnouncements = async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (categoryFilter) query.append('category', categoryFilter);

      const res = await fetch(`${API_URL}/announcements?${query.toString()}`, {
        headers: getAuthHeaders(token)
      });
      if (res.ok) setAnnouncements(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.readAnnouncements) {
      setReadIds(new Set(user.readAnnouncements));
    }
    fetchAnnouncements();
  }, [token, search, categoryFilter, user]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`${API_URL}/announcements/${id}/read`, {
        method: 'POST',
        headers: getAuthHeaders(token)
      });
      if (res.ok) {
        setReadIds(prev => new Set(prev).add(id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (id) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: '', content: '', category: 'General', isPinned: false });
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`${API_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="flex items-center gap-2 mb-4">
        <FaBullhorn size={24} color="var(--primary-color)" />
        <h2>Announcements</h2>
      </div>

      {user?.role === 'admin' && (
        <div className="card mb-4" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <h3>Post Announcement</h3>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="flex gap-4 mb-4">
              <div style={{ flex: 1 }}>
                <label className="form-label">Category</label>
                <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Examination">Examination</option>
                  <option value="Placement">Placement</option>
                  <option value="Events">Events</option>
                  <option value="Important">Important</option>
                </select>
              </div>
              <div className="flex items-center" style={{ flex: 1, marginTop: '1.5rem' }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isPinned} onChange={e => setFormData({...formData, isPinned: e.target.checked})} style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span style={{ fontWeight: '500' }}>Pin to top</span>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-input" rows="4" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Publish</button>
          </form>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <input 
          type="text" 
          placeholder="Search announcements..." 
          className="form-input" 
          style={{ flex: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="form-input" 
          style={{ flex: 1 }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="General">General</option>
          <option value="Academic">Academic</option>
          <option value="Examination">Examination</option>
          <option value="Placement">Placement</option>
          <option value="Events">Events</option>
          <option value="Important">Important</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="flex flex-col gap-4">
          {announcements.map(ann => {
            const dateObj = new Date(ann.createdAt);
            return (
              <div key={ann._id} className="card" style={{ padding: '1.5rem', position: 'relative', border: ann.isPinned ? '2px solid var(--primary-color)' : '' }}>
                {ann.isPinned && (
                  <div style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FaThumbtack /> Pinned
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{ann.title}</h4>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(ann._id)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer', padding: '0.5rem' }}>
                      <FaTrash />
                    </button>
                  )}
                </div>
                
                <div className="flex gap-4 mb-3" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{ann.category}</span>
                  <span>{dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span>By {ann.createdBy?.name}</span>
                </div>
                
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {expandedIds.has(ann._id) ? ann.content : ann.content.substring(0, 150) + (ann.content.length > 150 ? '...' : '')}
                </p>
                {ann.content.length > 150 && (
                  <button onClick={() => toggleExpand(ann._id)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', padding: 0, marginTop: '0.5rem', fontWeight: '500' }}>
                    {expandedIds.has(ann._id) ? 'Show Less' : 'Read More'}
                  </button>
                )}
                
                {user?.role !== 'admin' && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                    {!readIds.has(ann._id) ? (
                      <button onClick={() => handleMarkAsRead(ann._id)} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                        Mark as Read
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
                        <FaCheckCircle /> Read
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {announcements.length === 0 && (
            <div className="text-center p-8" style={{ backgroundColor: 'white', borderRadius: 'var(--radius)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No announcements found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Announcements;
