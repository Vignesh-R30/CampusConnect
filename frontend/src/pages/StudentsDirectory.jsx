import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserGraduate, FaSearch, FaFilter } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const StudentsDirectory = () => {
  const { token, user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('All');
  const [filterDept, setFilterDept] = useState('All');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/users`, { headers: getAuthHeaders(token) });
        if (res.ok) {
          setStudents(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') {
      fetchStudents();
    }
  }, [token, user]);

  if (user?.role !== 'admin') {
    return <div className="container text-center mt-8"><h2>Access Denied</h2><p>Only administrators can view the students directory.</p></div>;
  }

  const filteredStudents = students.filter(student => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = student.name.toLowerCase().includes(q) || student.email.toLowerCase().includes(q);
    const matchesYear = filterYear === 'All' || student.year === filterYear;
    const matchesDept = filterDept === 'All' || student.department === filterDept;
    
    return matchesSearch && matchesYear && matchesDept;
  });

  return (
    <div className="container">
      <div className="flex items-center gap-2 mb-6">
        <FaUserGraduate size={28} color="var(--primary-color)" />
        <h2 style={{ margin: 0 }}>Registered Students Directory</h2>
      </div>

      <div className="card mb-6" style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc' }}>
        <div className="flex gap-4 mb-3">
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            className="form-input" 
            style={{ flex: 2 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center">
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

          <select className="form-input" style={{ width: 'auto', padding: '0.4rem', fontSize: '0.9rem' }} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
            <option value="All">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
      </div>

      {loading ? <p>Loading students...</p> : (
        <div className="dashboard-grid">
          {filteredStudents.map(student => (
            <div key={student._id} className="card flex gap-4 items-center" style={{ padding: '1.5rem' }}>
              <img 
                src={student.profilePicture?.startsWith('/uploads') ? API_URL.replace('/api', '') + student.profilePicture : (student.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`)} 
                alt={student.name} 
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: 'var(--text-color)' }}>{student.name}</h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{student.email}</p>
                <div className="flex gap-2" style={{ fontSize: '0.8rem' }}>
                  <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>{student.department || 'N/A Dept'}</span>
                  <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>Year {student.year || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No students found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentsDirectory;
