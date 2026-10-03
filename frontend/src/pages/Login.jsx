import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student', adminKey: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
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
        <h2 className="text-center mb-4">Welcome Back</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label">Account Type</label>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setFormData({...formData, role: 'student'})} 
                className={`btn ${formData.role === 'student' ? 'btn-primary' : 'btn-outline'}`} 
                style={{ flex: 1 }}
              >
                Student
              </button>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, role: 'admin'})} 
                className={`btn ${formData.role === 'admin' ? 'btn-primary' : 'btn-outline'}`} 
                style={{ flex: 1, backgroundColor: formData.role === 'admin' ? '#8b5cf6' : '', borderColor: formData.role === 'admin' ? '#8b5cf6' : '' }}
              >
                Administrator
              </button>
            </div>
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
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
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
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
