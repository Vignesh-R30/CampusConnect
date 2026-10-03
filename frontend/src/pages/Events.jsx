import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaTrash, FaUsers, FaCheckCircle, FaBuilding } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const Events = () => {
  const { token, user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date-asc');

  // Admin form state
  const [formData, setFormData] = useState({ 
    title: '', description: '', date: '', location: '', organizer: '', category: 'Workshop', image: '', registrationDeadline: '', feeType: 'Free', feeAmount: '', paymentQrCode: '' 
  });

  // Registration modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [regData, setRegData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    section: '',
    collegeMailId: user?.email || '',
    registerNumber: '',
    eventType: 'Solo',
    teamMembers: '',
    upiId: '',
    transactionId: '',
    amountPaid: '',
    dateOfPayment: new Date().toISOString().split('T')[0]
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/events`, { headers: getAuthHeaders(token) });
      if (res.ok) setEvents(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: '', description: '', date: '', location: '', organizer: '', category: 'Workshop', image: '', registrationDeadline: '', feeType: 'Free', feeAmount: '', paymentQrCode: '' });
        fetchEvents();
      } else {
        const errData = await res.json();
        alert('Failed to publish event: ' + (errData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server to publish event');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`${API_URL}/events/${id}`, { method: 'DELETE', headers: getAuthHeaders(token) });
      if (res.ok) fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const res = await fetch(`${API_URL}/events/${selectedEvent._id}/register`, { 
        method: 'POST', 
        headers: getAuthHeaders(token),
        body: JSON.stringify(regData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Successfully registered for the event!');
        setMyRegistrations([...myRegistrations, selectedEvent._id]);
        setSelectedEvent(null);
      } else {
        alert(data.message || 'Failed to register');
      }
    } catch (err) {
      console.error(err);
      alert('Error registering for event');
    }
  };

  const [adminViewEvent, setAdminViewEvent] = useState(null);
  const [eventRegistrationsList, setEventRegistrationsList] = useState([]);

  const viewRegistrations = async (event) => {
    try {
      const res = await fetch(`${API_URL}/events/${event._id}/registrations`, { headers: getAuthHeaders(token) });
      const data = await res.json();
      if (res.ok) {
        setAdminViewEvent(event);
        setEventRegistrationsList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ position: 'relative' }}>
      <div className="flex items-center gap-2 mb-4">
        <FaCalendarAlt size={24} color="#f59e0b" />
        <h2>Campus Events</h2>
      </div>

      {user?.role === 'admin' && (
        <div className="card mb-4" style={{ borderLeft: '4px solid #f59e0b' }}>
          <h3>Create an Event</h3>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex gap-4 mb-4">
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Event Title</label>
                <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Category</label>
                <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Event Date & Time</label>
                <input type="datetime-local" className="form-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Registration Deadline</label>
                <input type="datetime-local" className="form-input" value={formData.registrationDeadline} onChange={e => setFormData({...formData, registrationDeadline: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Location</label>
                <input type="text" className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Organizer (Club/Dept)</label>
                <input type="text" className="form-input" value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} required />
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Fee Type</label>
                <select className="form-input" value={formData.feeType} onChange={e => setFormData({...formData, feeType: e.target.value})}>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              {formData.feeType === 'Paid' && (
                <>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Fee Amount (₹)</label>
                    <input type="number" className="form-input" value={formData.feeAmount} onChange={e => setFormData({...formData, feeAmount: e.target.value})} required />
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">Payment QR Code URL</label>
                    <input type="url" className="form-input" value={formData.paymentQrCode} onChange={e => setFormData({...formData, paymentQrCode: e.target.value})} required />
                  </div>
                </>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Cover Image URL (Optional)</label>
              <input type="url" className="form-input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#f59e0b' }}>Publish Event</button>
          </form>
        </div>
      )}

      <h3>Upcoming Events</h3>
      
      <div className="flex gap-4 mb-4 mt-2">
        <input 
          type="text" 
          placeholder="Search events by title, category, location..." 
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
          <option value="date-asc">Date: Upcoming First</option>
          <option value="date-desc">Date: Furthest First</option>
          <option value="fee-asc">Fee: Low to High (Free first)</option>
          <option value="fee-desc">Fee: High to Low</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="dashboard-grid mt-4">
          {events.filter(ev => {
            const query = searchQuery.toLowerCase();
            return ev.title.toLowerCase().includes(query) || 
                   ev.category.toLowerCase().includes(query) || 
                   ev.location.toLowerCase().includes(query);
          }).sort((a, b) => {
            if (sortOption === 'date-asc') return new Date(a.date) - new Date(b.date);
            if (sortOption === 'date-desc') return new Date(b.date) - new Date(a.date);
            if (sortOption === 'fee-asc') return (a.feeAmount || 0) - (b.feeAmount || 0);
            if (sortOption === 'fee-desc') return (b.feeAmount || 0) - (a.feeAmount || 0);
            return 0;
          }).map(ev => {
            const dateObj = new Date(ev.date);
            const isRegistered = myRegistrations.includes(ev._id);

            return (
              <div key={ev._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {ev.image ? (
                  <img src={ev.image} alt={ev.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCalendarAlt size={32} color="#f59e0b" style={{ opacity: 0.5 }} />
                  </div>
                )}
                
                <div style={{ padding: '1.5rem' }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span style={{ fontSize: '0.7rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: '1rem', marginBottom: '0.5rem', display: 'inline-block', marginRight: '0.5rem' }}>{ev.category}</span>
                      <span style={{ fontSize: '0.7rem', backgroundColor: ev.feeType === 'Paid' ? '#fee2e2' : '#d1fae5', color: ev.feeType === 'Paid' ? '#991b1b' : '#065f46', padding: '0.2rem 0.5rem', borderRadius: '1rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                        {ev.feeType === 'Paid' ? `₹${ev.feeAmount}` : 'Free'}
                      </span>
                      <h4 style={{ margin: 0 }}>{ev.title}</h4>
                    </div>
                    {(user.role === 'admin' || ev.createdBy?._id === user._id) && (
                      <button onClick={() => handleDelete(ev._id)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}>
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  
                  <p style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>📍 {ev.location}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}><FaBuilding /> By {ev.organizer}</p>
                  
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.description}</p>
                  
                  <div className="flex gap-2 border-t pt-3 mt-3" style={{ borderTop: '1px solid var(--border-color)', alignItems: 'center', justifyContent: 'space-between' }}>
                    {isRegistered ? (
                      <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaCheckCircle /> Registered</span>
                    ) : (
                      <button onClick={() => setSelectedEvent(ev)} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Register Now</button>
                    )}

                    {(user.role === 'admin' || ev.createdBy?._id === user._id) && (
                      <button onClick={() => viewRegistrations(ev)} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaUsers /> View</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {events.length === 0 && <p>No upcoming events.</p>}
        </div>
      )}

      {/* REGISTRATION MODAL */}
      {selectedEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 style={{ margin: 0 }}>Register for {selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <h4 className="mb-2 text-primary">Student Details</h4>
              <div className="flex gap-4 mb-3">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Name</label>
                  <input type="text" className="form-input" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Register Number</label>
                  <input type="text" className="form-input" value={regData.registerNumber} onChange={e => setRegData({...regData, registerNumber: e.target.value})} required />
                </div>
              </div>
              <div className="flex gap-4 mb-3">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Department</label>
                  <input type="text" className="form-input" value={regData.department} onChange={e => setRegData({...regData, department: e.target.value})} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Section</label>
                  <input type="text" className="form-input" value={regData.section} onChange={e => setRegData({...regData, section: e.target.value})} required />
                </div>
              </div>
              <div className="form-group mb-3">
                <label className="form-label">College Mail ID</label>
                <input type="email" className="form-input" value={regData.collegeMailId} onChange={e => setRegData({...regData, collegeMailId: e.target.value})} required />
              </div>

              <h4 className="mt-4 mb-2 text-primary">Event Participation</h4>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={regData.eventType === 'Solo'} onChange={() => setRegData({...regData, eventType: 'Solo'})} /> Solo
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={regData.eventType === 'Group'} onChange={() => setRegData({...regData, eventType: 'Group'})} /> Group
                </label>
              </div>
              {regData.eventType === 'Group' && (
                <div className="form-group mb-3">
                  <label className="form-label">Team Members Info (Names & Register Numbers)</label>
                  <textarea className="form-input" rows="3" value={regData.teamMembers} onChange={e => setRegData({...regData, teamMembers: e.target.value})} required></textarea>
                </div>
              )}

              {selectedEvent.feeType === 'Paid' && (
                <>
                  <h4 className="mt-4 mb-2 text-primary">Payment Details (Amount: ₹{selectedEvent.feeAmount})</h4>
                  {selectedEvent.paymentQrCode && (
                    <div className="flex flex-col items-center mb-4 p-4" style={{ backgroundColor: '#f8fafc', borderRadius: 'var(--radius)' }}>
                      <p className="mb-2" style={{ fontWeight: '500' }}>Scan to Pay</p>
                      <img src={selectedEvent.paymentQrCode} alt="Payment QR Code" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
                    </div>
                  )}
                  <div className="flex gap-4 mb-3">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Your UPI ID</label>
                      <input type="text" className="form-input" value={regData.upiId} onChange={e => setRegData({...regData, upiId: e.target.value})} required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Transaction ID</label>
                      <input type="text" className="form-input" value={regData.transactionId} onChange={e => setRegData({...regData, transactionId: e.target.value})} required />
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Amount Paid</label>
                      <input type="number" className="form-input" value={regData.amountPaid} onChange={e => setRegData({...regData, amountPaid: e.target.value})} required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Date of Payment</label>
                      <input type="date" className="form-input" value={regData.dateOfPayment} onChange={e => setRegData({...regData, dateOfPayment: e.target.value})} required />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <button type="button" className="btn btn-outline" onClick={() => setSelectedEvent(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#10b981' }}>Confirm Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN VIEW REGISTRATIONS MODAL */}
      {adminViewEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '95%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 style={{ margin: 0 }}>Registrations: {adminViewEvent.title}</h3>
              <button onClick={() => { setAdminViewEvent(null); setEventRegistrationsList([]); }} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <p className="mb-4">Total Registered: <strong>{eventRegistrationsList.length}</strong> students</p>
            
            {eventRegistrationsList.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ padding: '0.75rem' }}>Name & Reg. No</th>
                      <th style={{ padding: '0.75rem' }}>Dept/Sec</th>
                      <th style={{ padding: '0.75rem' }}>Mail ID</th>
                      <th style={{ padding: '0.75rem' }}>Type</th>
                      <th style={{ padding: '0.75rem' }}>Team Info</th>
                      {adminViewEvent.feeType === 'Paid' && <th style={{ padding: '0.75rem' }}>Payment Info</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {eventRegistrationsList.map(reg => (
                      <tr key={reg._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 'bold' }}>{reg.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{reg.registerNumber}</div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>{reg.department} - {reg.section}</td>
                        <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>{reg.collegeMailId}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ fontSize: '0.8rem', backgroundColor: reg.eventType === 'Solo' ? '#e0f2fe' : '#fef3c7', color: reg.eventType === 'Solo' ? '#0284c7' : '#d97706', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>
                            {reg.eventType}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{reg.eventType === 'Group' ? reg.teamMembers : '-'}</td>
                        {adminViewEvent.feeType === 'Paid' && (
                          <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                            <div><strong>UPI:</strong> {reg.upiId}</div>
                            <div><strong>Txn:</strong> {reg.transactionId}</div>
                            <div style={{ color: '#10b981', fontWeight: 'bold' }}>₹{reg.amountPaid} on {new Date(reg.dateOfPayment).toLocaleDateString()}</div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No one has registered for this event yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
