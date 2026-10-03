import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBriefcase, FaBuilding, FaMoneyBillWave, FaCalendarCheck, FaGraduationCap, FaPlus, FaTrash } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const Placements = () => {
  const { user, token } = useContext(AuthContext);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date-asc');

  // Form for Admin
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '', jobRole: '', package: '', driveDate: '', cgpaCriteria: 0, description: '', registrationLink: ''
  });

  const fetchPlacements = async () => {
    try {
      const res = await fetch(`${API_URL}/placements`, { headers: getAuthHeaders(token) });
      if (res.ok) setPlacements(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/placements`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ companyName: '', jobRole: '', package: '', driveDate: '', cgpaCriteria: 0, description: '', registrationLink: '' });
        setShowForm(false);
        fetchPlacements();
      } else {
        const err = await res.json();
        alert('Failed to post placement drive: ' + err.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;
    try {
      const res = await fetch(`${API_URL}/placements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      if (res.ok) fetchPlacements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaBriefcase size={28} color="#059669" />
          <h2 style={{ margin: 0 }}>Placement Cell</h2>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex items-center gap-2" style={{ backgroundColor: '#059669' }}>
            <FaPlus /> {showForm ? 'Cancel Post' : 'Post Drive'}
          </button>
        )}
      </div>

      {showForm && user?.role === 'admin' && (
        <div className="card mb-6" style={{ borderTop: '4px solid #059669' }}>
          <h3>Post Upcoming Campus Drive</h3>
          <form onSubmit={handleCreate} className="mt-4">
            <div className="flex gap-4 mb-3">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Company Name</label>
                <input type="text" className="form-input" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Job Role</label>
                <input type="text" className="form-input" value={formData.jobRole} onChange={e => setFormData({...formData, jobRole: e.target.value})} required />
              </div>
            </div>

            <div className="flex gap-4 mb-3">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Package / CTC</label>
                <input type="text" className="form-input" value={formData.package} onChange={e => setFormData({...formData, package: e.target.value})} required placeholder="e.g. 10 LPA" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Drive Date</label>
                <input type="date" className="form-input" value={formData.driveDate} onChange={e => setFormData({...formData, driveDate: e.target.value})} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">CGPA Criteria</label>
                <input type="number" step="0.1" min="0" max="10" className="form-input" value={formData.cgpaCriteria} onChange={e => setFormData({...formData, cgpaCriteria: Number(e.target.value)})} required />
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Registration / Application Link</label>
              <input type="url" className="form-input" value={formData.registrationLink} onChange={e => setFormData({...formData, registrationLink: e.target.value})} required placeholder="https://..." />
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Job Description & Requirements</label>
              <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#059669' }}>Post Drive</button>
          </form>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <input 
          type="text" 
          placeholder="Search companies or job roles..." 
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
          <option value="date-asc">Drive Date: Upcoming</option>
          <option value="date-desc">Drive Date: Furthest</option>
          <option value="cgpa-desc">CGPA Criteria: High to Low</option>
          <option value="cgpa-asc">CGPA Criteria: Low to High</option>
          <option value="company-asc">Company: A to Z</option>
        </select>
      </div>

      {loading ? <p>Loading drives...</p> : (
        <div className="dashboard-grid">
          {placements.filter(drive => {
            const q = searchQuery.toLowerCase();
            return drive.companyName.toLowerCase().includes(q) || drive.jobRole.toLowerCase().includes(q);
          }).sort((a, b) => {
            if (sortOption === 'date-asc') return new Date(a.driveDate) - new Date(b.driveDate);
            if (sortOption === 'date-desc') return new Date(b.driveDate) - new Date(a.driveDate);
            if (sortOption === 'cgpa-desc') return b.cgpaCriteria - a.cgpaCriteria;
            if (sortOption === 'cgpa-asc') return a.cgpaCriteria - b.cgpaCriteria;
            if (sortOption === 'company-asc') return a.companyName.localeCompare(b.companyName);
            return 0;
          }).map(drive => {
            const d = new Date(drive.driveDate);
            const isUpcoming = d >= new Date();
            
            return (
              <div key={drive._id} className="card" style={{ padding: '1.5rem', borderLeft: isUpcoming ? '4px solid #10b981' : '4px solid #94a3b8', display: 'flex', flexDirection: 'column' }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857' }}>
                      <FaBuilding /> {drive.companyName}
                    </h3>
                    <h4 style={{ margin: 0, color: 'var(--text-color)' }}>{drive.jobRole}</h4>
                  </div>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(drive._id)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}>
                      <FaTrash />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2 mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave color="#10b981" /> <strong>Package:</strong> {drive.package}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarCheck color="#3b82f6" /> <strong>Drive Date:</strong> {d.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGraduationCap color="#f59e0b" /> <strong>Eligibility:</strong> {drive.cgpaCriteria}+ CGPA
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, whiteSpace: 'pre-wrap' }}>
                  {drive.description}
                </p>

                <div className="border-t pt-3 mt-auto flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Posted by Placement Cell</span>
                  <a href={drive.registrationLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.4rem 1.2rem', backgroundColor: '#059669' }}>
                    Apply Now
                  </a>
                </div>
              </div>
            );
          })}
          {placements.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No upcoming placement drives at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Placements;
