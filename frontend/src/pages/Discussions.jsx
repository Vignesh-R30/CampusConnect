import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaComments, FaHeart, FaReply, FaTrash, FaFlag } from 'react-icons/fa';
import API_URL, { getAuthHeaders } from '../services/api';

const Discussions = () => {
  const { user, token } = useContext(AuthContext);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('latest');

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General' });
  const [commentInputs, setCommentInputs] = useState({});

  const fetchDiscussions = async () => {
    try {
      const res = await fetch(`${API_URL}/discussions`, { headers: getAuthHeaders(token) });
      if (res.ok) setDiscussions(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/discussions`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: '', content: '', category: 'General' });
        setShowForm(false);
        fetchDiscussions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const res = await fetch(`${API_URL}/discussions/${id}/upvote`, {
        method: 'POST',
        headers: getAuthHeaders(token)
      });
      if (res.ok) fetchDiscussions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e, id) => {
    e.preventDefault();
    if (!commentInputs[id]) return;
    try {
      const res = await fetch(`${API_URL}/discussions/${id}/comment`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ text: commentInputs[id] })
      });
      if (res.ok) {
        setCommentInputs({ ...commentInputs, [id]: '' });
        fetchDiscussions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;
    try {
      const res = await fetch(`${API_URL}/discussions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      if (res.ok) fetchDiscussions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async (id) => {
    if (!window.confirm('Are you sure you want to report this post as inappropriate?')) return;
    try {
      const res = await fetch(`${API_URL}/discussions/${id}/report`, {
        method: 'POST',
        headers: getAuthHeaders(token)
      });
      if (res.ok) {
        alert('Discussion reported successfully.');
        fetchDiscussions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaComments size={28} color="#0284c7" />
          <h2 style={{ margin: 0 }}>Community Discussions</h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ backgroundColor: '#0284c7' }}>
          {showForm ? 'Cancel' : 'Start a Discussion'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6" style={{ borderLeft: '4px solid #0284c7' }}>
          <form onSubmit={handleCreate}>
            <div className="form-group mb-3">
              <label className="form-label">Topic Title</label>
              <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="What do you want to discuss?" />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Category</label>
              <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="General">General</option>
                <option value="Academics">Academics</option>
                <option value="Programming">Programming</option>
                <option value="Placements">Placements</option>
                <option value="Campus Life">Campus Life</option>
                <option value="Events">Events</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label className="form-label">Details</label>
              <textarea className="form-input" rows="4" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required placeholder="Add more details..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0284c7' }}>Post Discussion</button>
          </form>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <input 
          type="text" 
          placeholder="Search discussions by title or category..." 
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
          <option value="upvotes-desc">Most Upvoted</option>
          <option value="comments-desc">Most Commented</option>
        </select>
      </div>

      {loading ? <p>Loading discussions...</p> : (
        <div className="flex flex-col gap-4">
          {discussions.filter(disc => {
            const q = searchQuery.toLowerCase();
            return disc.title.toLowerCase().includes(q) || disc.category.toLowerCase().includes(q);
          }).sort((a, b) => {
            if (sortOption === 'upvotes-desc') return b.upvotes.length - a.upvotes.length;
            if (sortOption === 'comments-desc') return b.comments.length - a.comments.length;
            if (sortOption === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            return 0;
          }).map(disc => {
            const hasUpvoted = disc.upvotes.includes(user._id);
            return (
              <div key={disc._id} className="card" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem' }}>
                {/* Vote Sidebar */}
                <div className="flex flex-col items-center gap-1" style={{ width: '40px' }}>
                  <button onClick={() => handleUpvote(disc._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: hasUpvoted ? '#ef4444' : 'var(--text-secondary)' }}>
                    <FaHeart size={20} />
                  </button>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: hasUpvoted ? '#ef4444' : 'inherit' }}>{disc.upvotes.length}</span>
                </div>
                
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2 mb-1 justify-between">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '0.7rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>{disc.category}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• Posted by {disc.author?.name} on {new Date(disc.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {(user.role === 'admin' || disc.author?._id === user._id) && (
                        <button onClick={() => handleDelete(disc._id)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer', fontSize: '0.9rem' }} title="Delete Post">
                          <FaTrash />
                        </button>
                      )}
                      <button onClick={() => handleReport(disc._id)} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: '0.9rem' }} title="Report Post">
                        <FaFlag />
                      </button>
                    </div>
                  </div>
                  <h4 style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '1.2rem' }}>{disc.title}</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-color)', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{disc.content}</p>
                  
                  <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <FaReply /> {disc.comments.length} Comments
                  </div>

                  {/* Comments Section */}
                  <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius)', marginLeft: '-1rem', marginRight: '-1rem' }}>
                    {disc.comments.length > 0 && (
                      <div className="flex flex-col gap-3 mb-4">
                        {disc.comments.map((comment, i) => (
                          <div key={i} className="flex gap-2 text-sm border-l-2 pl-3" style={{ borderColor: 'var(--border-color)' }}>
                            <strong style={{ whiteSpace: 'nowrap' }}>{comment.user?.name}:</strong>
                            <span style={{ wordBreak: 'break-word' }}>{comment.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <form onSubmit={(e) => handleComment(e, disc._id)} className="flex gap-2">
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} 
                        placeholder="Add a comment..."
                        value={commentInputs[disc._id] || ''}
                        onChange={e => setCommentInputs({...commentInputs, [disc._id]: e.target.value})}
                        required
                      />
                      <button type="submit" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Reply</button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
          {discussions.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No discussions yet. Be the first to start one!</p>}
        </div>
      )}
    </div>
  );
};

export default Discussions;
