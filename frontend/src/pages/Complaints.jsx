import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBullhorn, FaImage } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const Complaints = () => {
  const { token, user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Maintenance', location: '', image: '' });
  
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_URL}/complaints`, { headers: getAuthHeaders(token) });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = formData.image;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData
        });

        if (uploadRes.ok) {
          imageUrl = await uploadRes.text();
        } else {
          const err = await uploadRes.json();
          alert('Image upload failed: ' + err.message);
          setUploading(false);
          return;
        }
      }

      const res = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ ...formData, image: imageUrl })
      });
      if (res.ok) {
        setFormData({ title: '', description: '', category: 'Maintenance', location: '', image: '' });
        setImageFile(null);
        fetchComplaints();
      } else {
        const err = await res.json();
        alert('Error: ' + err.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/complaints/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="flex items-center gap-2 mb-4">
        <FaBullhorn size={24} color="var(--primary-color)" />
        <h2>Complaints System</h2>
      </div>

      <div className="card mb-4">
        <h3>File a New Complaint</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Maintenance">Maintenance</option>
              <option value="Academic">Academic</option>
              <option value="Hostel">Hostel</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Location</label>
              <input type="text" className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label flex items-center gap-2"><FaImage /> Attach Photo</label>
              <input type="file" accept="image/*" className="form-input" onChange={e => setImageFile(e.target.files[0])} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>

      <div className="flex gap-4 mb-4 mt-6">
        <input 
          type="text" 
          placeholder="Search complaints by title, category, or location..." 
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
          <option value="latest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="status-pending">Pending First</option>
          <option value="status-resolved">Resolved First</option>
        </select>
      </div>

      <h3>Recent Complaints</h3>
      {loading ? <p>Loading...</p> : (
        <div className="dashboard-grid mt-4">
          {complaints.filter(comp => {
            const q = searchQuery.toLowerCase();
            return comp.title.toLowerCase().includes(q) || 
                   comp.category.toLowerCase().includes(q) || 
                   comp.location.toLowerCase().includes(q);
          }).sort((a, b) => {
            if (sortOption === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortOption === 'status-pending') {
              const weight = { 'Pending': 1, 'In Progress': 2, 'Resolved': 3 };
              return weight[a.status] - weight[b.status];
            }
            if (sortOption === 'status-resolved') {
              const weight = { 'Pending': 3, 'In Progress': 2, 'Resolved': 1 };
              return weight[a.status] - weight[b.status];
            }
            return 0;
          }).map(comp => (
            <div key={comp._id} className="card" style={{ padding: '1.5rem' }}>
              <div className="flex justify-between items-center mb-2">
                <h4 style={{ margin: 0 }}>{comp.title}</h4>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '1rem', backgroundColor: comp.status === 'Resolved' ? '#d1fae5' : comp.status === 'In Progress' ? '#fef3c7' : '#fee2e2', color: comp.status === 'Resolved' ? '#065f46' : comp.status === 'In Progress' ? '#92400e' : '#991b1b' }}>
                  {comp.status}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{comp.category} • {comp.location}</p>
              
              {comp.image && (
                <div style={{ marginBottom: '1rem', borderRadius: 'var(--radius)', overflow: 'hidden', maxHeight: '200px' }}>
                  <img src={comp.image.startsWith('/uploads') ? API_URL.replace('/api', '') + comp.image : comp.image} alt="Complaint Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{comp.description}</p>
              
              {(user.role === 'admin' || comp.createdBy?._id === user._id) && comp.status !== 'Resolved' && (
                <div className="flex gap-2 border-t pt-2 mt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                  {user.role === 'admin' && comp.status === 'Pending' && (
                    <button onClick={() => handleStatusUpdate(comp._id, 'In Progress')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Mark In Progress</button>
                  )}
                  <button onClick={() => handleStatusUpdate(comp._id, 'Resolved')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: 'var(--secondary-color)', borderColor: 'var(--secondary-color)' }}>Mark Resolved</button>
                </div>
              )}
            </div>
          ))}
          {complaints.length === 0 && <p>No complaints filed yet.</p>}
        </div>
      )}
    </div>
  );
};

export default Complaints;
