import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaSearch, FaImage } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const LostFound = () => {
  const { token, user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Electronics', location: '', type: 'Lost', image: '' });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/lostfound`, { headers: getAuthHeaders(token) });
      if (res.ok) setItems(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = formData.image;

      // Handle file upload first if a file was selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }, // FormData automatically sets multipart/form-data
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

      const res = await fetch(`${API_URL}/lostfound`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ ...formData, image: imageUrl })
      });
      
      if (res.ok) {
        setFormData({ title: '', description: '', category: 'Electronics', location: '', type: 'Lost', image: '' });
        setImageFile(null);
        fetchItems();
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
      const res = await fetch(`${API_URL}/lostfound/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="flex items-center gap-2 mb-4">
        <FaSearch size={24} color="var(--secondary-color)" />
        <h2>Lost & Found</h2>
      </div>

      <div className="card mb-4">
        <h3>Post an Item</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex gap-4 mb-4">
            <button type="button" onClick={() => setFormData({...formData, type: 'Lost'})} className={`btn ${formData.type === 'Lost' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, backgroundColor: formData.type === 'Lost' ? '#ef4444' : '' }}>I Lost Something</button>
            <button type="button" onClick={() => setFormData({...formData, type: 'Found'})} className={`btn ${formData.type === 'Found' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, backgroundColor: formData.type === 'Found' ? '#10b981' : '' }}>I Found Something</button>
          </div>
          
          <div className="form-group">
            <label className="form-label">Item Title</label>
            <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Electronics">Electronics</option>
              <option value="Wallet/ID">Wallet/ID</option>
              <option value="Keys">Keys</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Location (Where it was lost/found)</label>
              <input type="text" className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label flex items-center gap-2"><FaImage /> Attach Photo</label>
              <input type="file" accept="image/*" className="form-input" onChange={e => setImageFile(e.target.files[0])} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description & Contact Info</label>
            <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Post Item'}
          </button>
        </form>
      </div>

      <div className="flex gap-4 mb-4 mt-6">
        <input 
          type="text" 
          placeholder="Search items by title, category, or location..." 
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
          <option value="type-lost">Lost Items First</option>
          <option value="type-found">Found Items First</option>
        </select>
      </div>

      <h3>Active Listings</h3>
      {loading ? <p>Loading...</p> : (
        <div className="dashboard-grid mt-4">
          {items.filter(item => {
            const q = searchQuery.toLowerCase();
            return item.title.toLowerCase().includes(q) || 
                   item.category.toLowerCase().includes(q) || 
                   item.location.toLowerCase().includes(q);
          }).sort((a, b) => {
            if (sortOption === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortOption === 'type-lost') return a.type === 'Lost' ? -1 : 1;
            if (sortOption === 'type-found') return a.type === 'Found' ? -1 : 1;
            return 0;
          }).map(item => (
            <div key={item._id} className="card" style={{ padding: '1.5rem', opacity: item.status === 'Resolved' ? 0.6 : 1 }}>
              <div className="flex justify-between items-center mb-2">
                <h4 style={{ margin: 0 }}>{item.title}</h4>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '1rem', color: 'white', backgroundColor: item.type === 'Lost' ? '#ef4444' : '#10b981' }}>
                  {item.type}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{item.category} • {item.location}</p>
              
              {item.image && (
                <div style={{ marginBottom: '1rem', borderRadius: 'var(--radius)', overflow: 'hidden', maxHeight: '200px' }}>
                  <img src={item.image.startsWith('/uploads') ? API_URL.replace('/api', '') + item.image : item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{item.description}</p>
              
              <div className="flex justify-between items-center border-t pt-2 mt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Posted by: {item.createdBy?.name}</span>
                
                {(user.role === 'admin' || item.createdBy?._id === user._id) && item.status !== 'Resolved' && (
                  <button onClick={() => handleStatusUpdate(item._id, 'Resolved')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Mark Resolved</button>
                )}
                {item.status === 'Resolved' && <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>Resolved</span>}
              </div>
            </div>
          ))}
          {items.length === 0 && <p>No items listed yet.</p>}
        </div>
      )}
    </div>
  );
};

export default LostFound;
