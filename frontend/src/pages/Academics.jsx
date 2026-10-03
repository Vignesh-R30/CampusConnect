import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBook, FaDownload, FaTrash, FaPlus, FaFilter } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const Academics = () => {
  const { user, token } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterDept, setFilterDept] = useState('All');
  const [filterSem, setFilterSem] = useState('0');
  const [filterType, setFilterType] = useState('All');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('latest');

  // Form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', department: 'All', semester: 0, subjectCode: '', resourceType: 'Notes', fileUrl: ''
  });

  const fetchResources = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filterDept !== 'All') query.append('department', filterDept);
      if (filterSem !== '0') query.append('semester', filterSem);
      if (filterType !== 'All') query.append('type', filterType);

      const res = await fetch(`${API_URL}/academics?${query.toString()}`, { headers: getAuthHeaders(token) });
      if (res.ok) setResources(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [token, filterDept, filterSem, filterType]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/academics`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: '', description: '', department: 'All', semester: 0, subjectCode: '', resourceType: 'Notes', fileUrl: '' });
        setShowForm(false);
        fetchResources();
      } else {
        const err = await res.json();
        alert('Failed to upload: ' + err.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await fetch(`${API_URL}/academics/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      if (res.ok) {
        fetchResources();
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaBook size={28} color="#8b5cf6" />
          <h2 style={{ margin: 0 }}>Digital Library</h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex items-center gap-2" style={{ backgroundColor: '#8b5cf6' }}>
          <FaPlus /> {showForm ? 'Cancel Upload' : 'Upload Resource'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6" style={{ borderTop: '4px solid #8b5cf6' }}>
          <h3>Upload Study Material</h3>
          <form onSubmit={handleUpload} className="mt-4">
            <div className="flex gap-4 mb-3">
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Title / Document Name</label>
                <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Type</label>
                <select className="form-input" value={formData.resourceType} onChange={e => setFormData({...formData, resourceType: e.target.value})}>
                  <option value="Notes">Notes</option>
                  <option value="Syllabus">Syllabus</option>
                  <option value="Question Paper">Question Paper</option>
                  <option value="E-Book">E-Book</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-3">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Department</label>
                <select className="form-input" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                  <option value="All">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="IT">IT</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Semester (0 for General)</label>
                <input type="number" min="0" max="8" className="form-input" value={formData.semester} onChange={e => setFormData({...formData, semester: Number(e.target.value)})} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Subject Code (Optional)</label>
                <input type="text" className="form-input" value={formData.subjectCode} onChange={e => setFormData({...formData, subjectCode: e.target.value})} />
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">File URL (Google Drive link, direct PDF link, etc.)</label>
              <input type="url" className="form-input" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} required placeholder="https://..." />
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Brief Description</label>
              <textarea className="form-input" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#8b5cf6' }}>Upload Document</button>
          </form>
        </div>
      )}

      {/* Filters, Search & Sort */}
      <div className="card mb-6" style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc' }}>
        <div className="flex gap-4 items-center mb-3">
          <FaFilter color="var(--text-secondary)" />
          <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>Filters:</span>
          
          <select className="form-input" style={{ width: 'auto', padding: '0.4rem', fontSize: '0.9rem' }} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="IT">IT</option>
          </select>

          <select className="form-input" style={{ width: 'auto', padding: '0.4rem', fontSize: '0.9rem' }} value={filterSem} onChange={e => setFilterSem(e.target.value)}>
            <option value="0">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
          </select>

          <select className="form-input" style={{ width: 'auto', padding: '0.4rem', fontSize: '0.9rem' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Notes">Notes</option>
            <option value="Syllabus">Syllabus</option>
            <option value="Question Paper">Question Paper</option>
            <option value="E-Book">E-Book</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search resources by title or subject code..." 
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
            <option value="latest">Newest Uploads</option>
            <option value="oldest">Oldest Uploads</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>
      </div>

      {loading ? <p>Loading library...</p> : (
        <div className="dashboard-grid">
          {resources.filter(res => {
            const q = searchQuery.toLowerCase();
            return res.title.toLowerCase().includes(q) || 
                   (res.subjectCode && res.subjectCode.toLowerCase().includes(q));
          }).sort((a, b) => {
            if (sortOption === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortOption === 'title-asc') return a.title.localeCompare(b.title);
            return 0;
          }).map(res => (
            <div key={res._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex justify-between items-start mb-2">
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#8b5cf6' }}>{res.title}</h4>
                <span style={{ fontSize: '0.7rem', backgroundColor: '#ede9fe', color: '#6d28d9', padding: '0.2rem 0.5rem', borderRadius: '1rem', whiteSpace: 'nowrap' }}>
                  {res.resourceType}
                </span>
              </div>
              
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Dept: {res.department}</span>
                <span style={{ backgroundColor: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Sem: {res.semester === 0 ? 'Gen' : res.semester}</span>
                {res.subjectCode && res.subjectCode !== 'General' && (
                   <span style={{ backgroundColor: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{res.subjectCode}</span>
                )}
              </div>

              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{res.description}</p>

              <div className="flex items-center justify-between border-t pt-3 mt-auto" style={{ borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>By: {res.uploadedBy?.name}</span>
                
                <div className="flex gap-2">
                  {(user.role === 'admin' || res.uploadedBy?._id === user._id) && (
                    <button onClick={() => handleDelete(res._id)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer', padding: '0.3rem' }}>
                      <FaTrash />
                    </button>
                  )}
                  <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline flex items-center gap-2" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', color: '#8b5cf6', borderColor: '#8b5cf6' }}>
                    <FaDownload /> View
                  </a>
                </div>
              </div>
            </div>
          ))}
          {resources.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No resources found matching the criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Academics;
