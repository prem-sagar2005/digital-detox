import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Edit2, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateProfile(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        My Profile
      </h1>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        {/* Profile Header */}
        <div className="card-header flex-between">
          <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {user?.fullName || user?.username}
              </h2>
              <p className="text-muted">@{user?.username}</p>
            </div>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : <><Edit2 size={16} /> Edit Profile</>}
          </button>
        </div>

        {/* Profile Info */}
        <div style={{ marginTop: '1.5rem' }}>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <User size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div>
              <div className="mb-3">
                <label className="form-label">
                  <Mail size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                  Email
                </label>
                <p style={{ padding: '0.75rem', background: 'var(--light)', borderRadius: '0.5rem' }}>
                  {user?.email}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <User size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                  Full Name
                </label>
                <p style={{ padding: '0.75rem', background: 'var(--light)', borderRadius: '0.5rem' }}>
                  {user?.fullName || 'Not set'}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">Bio</label>
                <p style={{ padding: '0.75rem', background: 'var(--light)', borderRadius: '0.5rem', minHeight: '100px' }}>
                  {user?.bio || 'No bio added yet'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <div className="card mt-3">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Account Information
        </h3>
        <div className="grid grid-2">
          <div>
            <p className="text-muted">Member Since</p>
            <p style={{ fontWeight: '500' }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-muted">Username</p>
            <p style={{ fontWeight: '500' }}>@{user?.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

















