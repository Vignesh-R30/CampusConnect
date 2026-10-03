import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '', 
    college: '', department: '', year: '', profilePicture: '', role: 'student', adminKey: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);

    try {
      let uploadedProfilePicture = '';
      if (profileImageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', profileImageFile);
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formDataUpload,
        });
        if (uploadRes.ok) {
          uploadedProfilePicture = await uploadRes.text();
        } else {
          setIsLoading(false);
          return setError('Failed to upload profile picture');
        }
      }

      const finalFormData = { ...formData, profilePicture: uploadedProfilePicture };

      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card max-w-md mt-4">
        <h2 className="text-center mb-4">Create Account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">College</label>
            <input type="text" name="college" className="form-input" value={formData.college} onChange={handleChange} required />
          </div>
          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Department</label>
              <input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} required />
            </div>
            {formData.role === 'student' && (
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Year</label>
                <select name="year" className="form-input" value={formData.year} onChange={handleChange} required={formData.role === 'student'}>
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Profile Picture (Optional)</label>
            <input type="file" accept="image/*" className="form-input" onChange={(e) => setProfileImageFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required minLength="6" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" className="form-input" value={formData.confirmPassword} onChange={handleChange} required minLength="6" />
          </div>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select name="role" className="form-input" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          {formData.role === 'admin' && (
            <div className="form-group">
              <label className="form-label" style={{ color: '#8b5cf6' }}>Admin Secret Key</label>
              <input
                type="password"
                name="adminKey"
                className="form-input"
                value={formData.adminKey}
                onChange={handleChange}
                required={formData.role === 'admin'}
                placeholder="Enter the administrative access key"
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading} style={{ backgroundColor: formData.role === 'admin' ? '#8b5cf6' : '' }}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
