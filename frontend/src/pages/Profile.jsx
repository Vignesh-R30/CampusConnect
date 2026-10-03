import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaIdBadge, FaUniversity, FaCalendarAlt, FaTools, FaInfoCircle } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const Profile = () => {
  const { user, token, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        college: user.college || '',
        department: user.department || '',
        year: user.year || '',
        profilePicture: user.profilePicture || '',
        skills: user.skills ? user.skills.join(', ') : '',
        interests: user.interests ? user.interests.join(', ') : '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = { ...formData };
      payload.skills = payload.skills.split(',').map(s => s.trim()).filter(Boolean);
      payload.interests = payload.interests.split(',').map(s => s.trim()).filter(Boolean);

      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        login(data, token);
        setMessage({ text: 'Profile updated successfully', type: 'success' });
        setIsEditing(false);
      } else {
        setMessage({ text: data.message || 'Failed to update', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Server error', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setMessage({ text: 'Uploading image...', type: '' });

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData
      });

      if (uploadRes.ok) {
        const imageUrl = await uploadRes.text();
        
        // Immediately save the new image to user profile
        const res = await fetch(`${API_URL}/auth/profile`, {
          method: 'PUT',
          headers: getAuthHeaders(token),
          body: JSON.stringify({ profilePicture: imageUrl })
        });
        
        const data = await res.json();
        if (res.ok) {
          login(data, token); // Update context user
          setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
          setMessage({ text: 'Profile picture updated successfully!', type: 'success' });
        } else {
          setMessage({ text: data.message || 'Failed to update profile picture', type: 'error' });
        }
      } else {
        const err = await uploadRes.json();
        setMessage({ text: 'Upload failed: ' + err.message, type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Server error during upload', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ password: passwordData.newPassword })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Password changed successfully', type: 'success' });
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '' });
      } else {
        setMessage({ text: data.message || 'Failed to change password', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Server error', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container">
      <div className="card max-w-md mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ margin: 0 }}>My Profile</h2>
          <div>
            {!isEditing && !isChangingPassword && (
              <>
                <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}>Edit</button>
                <button onClick={() => setIsChangingPassword(true)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>Password</button>
              </>
            )}
            {(isEditing || isChangingPassword) && (
              <button onClick={() => { setIsEditing(false); setIsChangingPassword(false); }} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>Cancel</button>
            )}
          </div>
        </div>
        
        {message.text && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : ''}`} style={{ backgroundColor: message.type === 'success' ? '#d1fae5' : undefined, color: message.type === 'success' ? '#065f46' : undefined, borderColor: message.type === 'success' ? '#34d399' : undefined }}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col items-center mb-4 relative">
          <div style={{ position: 'relative' }}>
            {user.profilePicture ? (
              <img src={user.profilePicture.startsWith('/uploads') ? API_URL.replace('/api', '') + user.profilePicture : user.profilePicture} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-color)' }} />
            ) : (
              <FaUserCircle size={100} color="var(--primary-color)" />
            )}
            <label htmlFor="profile-upload" style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: 'var(--primary-color)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} title="Change Profile Picture">
              +
            </label>
            <input id="profile-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={isLoading} />
          </div>
        </div>

        {isChangingPassword ? (
          <form onSubmit={handleUpdatePassword} className="mt-4">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" name="currentPassword" className="form-input" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" name="newPassword" className="form-input" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength="6" />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>Change Password</button>
          </form>
        ) : isEditing ? (
          <form onSubmit={handleUpdateProfile} className="mt-4">
            <div className="form-group"><label className="form-label">Full Name</label><input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Email Address</label><input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required /></div>
            <div className="flex gap-4 mb-4">
              <div style={{ flex: 1 }}><label className="form-label">College</label><input type="text" name="college" className="form-input" value={formData.college} onChange={handleChange} /></div>
              <div style={{ flex: 1 }}><label className="form-label">Department</label><input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} /></div>
            </div>
            <div className="form-group"><label className="form-label">Year</label><input type="text" name="year" className="form-input" value={formData.year} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Skills (comma separated)</label><input type="text" name="skills" className="form-input" value={formData.skills} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Interests (comma separated)</label><input type="text" name="interests" className="form-input" value={formData.interests} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Bio</label><textarea name="bio" className="form-input" rows="3" value={formData.bio} onChange={handleChange}></textarea></div>
            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>Save Profile</button>
          </form>
        ) : (
          <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex items-center gap-4" style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius)' }}>
              <FaIdBadge size={24} color="var(--text-secondary)" />
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Full Name</p><p style={{ fontWeight: '500' }}>{user.name}</p></div>
            </div>
            <div className="flex items-center gap-4" style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius)' }}>
              <FaEnvelope size={24} color="var(--text-secondary)" />
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email</p><p style={{ fontWeight: '500' }}>{user.email}</p></div>
            </div>
            <div className="flex items-center gap-4" style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius)' }}>
              <FaUniversity size={24} color="var(--text-secondary)" />
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>College & Dept</p><p style={{ fontWeight: '500' }}>{user.college || '-'} • {user.department || '-'}</p></div>
            </div>
            <div className="flex items-center gap-4" style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius)' }}>
              <FaCalendarAlt size={24} color="var(--text-secondary)" />
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Year</p><p style={{ fontWeight: '500' }}>{user.year || '-'}</p></div>
            </div>
            <div className="flex items-center gap-4" style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius)' }}>
              <FaTools size={24} color="var(--text-secondary)" />
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Skills</p><p style={{ fontWeight: '500' }}>{user.skills?.length ? user.skills.join(', ') : '-'}</p></div>
            </div>
            <div className="flex items-center gap-4" style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius)' }}>
              <FaInfoCircle size={24} color="var(--text-secondary)" />
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Bio</p><p style={{ fontWeight: '500' }}>{user.bio || '-'}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
