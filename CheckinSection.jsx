import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Smile, Heart, Zap, Cloud, AlertCircle, Meh, X } from 'lucide-react';

const CheckinSection = ({ tripId }) => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    mood: 'neutral',
    stressLevel: 5,
    screenTime: 0,
    notes: ''
  });

  const moodIcons = {
    happy: <Smile size={24} />,
    relaxed: <Cloud size={24} />,
    energetic: <Zap size={24} />,
    peaceful: <Heart size={24} />,
    stressed: <AlertCircle size={24} />,
    anxious: <AlertCircle size={24} />,
    neutral: <Meh size={24} />
  };

  useEffect(() => {
    fetchCheckins();
  }, [tripId]);

  const fetchCheckins = async () => {
    try {
      const response = await axios.get(`/checkins/trip/${tripId}`);
      setCheckins(response.data.checkins);
    } catch (error) {
      console.error('Failed to fetch check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/checkins', { ...formData, tripID: parseInt(tripId) });
      setShowModal(false);
      setFormData({ mood: 'neutral', stressLevel: 5, screenTime: 0, notes: '' });
      fetchCheckins();
    } catch (error) {
      console.error('Failed to create check-in:', error);
      alert('Failed to create check-in');
    }
  };

  const handleDelete = async (checkinId) => {
    if (window.confirm('Are you sure you want to delete this check-in?')) {
      try {
        await axios.delete(`/checkins/${checkinId}`);
        fetchCheckins();
      } catch (error) {
        console.error('Failed to delete check-in:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex-center"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Emotional Check-ins</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          New Check-in
        </button>
      </div>

      {checkins.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 2rem' }}>
          <Heart size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray)', opacity: 0.5 }} />
          <p className="text-muted">No check-ins yet. Start tracking your emotional journey!</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {checkins.map(checkin => (
            <div key={checkin.checkinID} className="card">
              <div className="flex-between mb-2">
                <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                  {moodIcons[checkin.mood]}
                  <span className="badge badge-primary">{checkin.mood}</span>
                </div>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => handleDelete(checkin.checkinID)}
                  style={{ padding: '0.25rem 0.5rem' }}
                >
                  Delete
                </button>
              </div>

              <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                {new Date(checkin.checkinDate).toLocaleString()}
              </p>

              <div className="grid grid-2" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>Stress Level</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{checkin.stressLevel}/10</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>Screen Time</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{checkin.screenTime} min</p>
                </div>
              </div>

              {checkin.notes && (
                <div style={{
                  padding: '0.75rem',
                  background: 'var(--light)',
                  borderRadius: '0.5rem',
                  borderLeft: '3px solid var(--primary)'
                }}>
                  <p style={{ fontSize: '0.875rem' }}>{checkin.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Check-in Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Check-in</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Mood</label>
                <select
                  className="form-select"
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  required
                >
                  <option value="happy">Happy</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="energetic">Energetic</option>
                  <option value="peaceful">Peaceful</option>
                  <option value="stressed">Stressed</option>
                  <option value="anxious">Anxious</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Stress Level (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={(e) => setFormData({ ...formData, stressLevel: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <div className="text-center" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {formData.stressLevel}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Screen Time (minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.screenTime}
                  onChange={(e) => setFormData({ ...formData, screenTime: parseInt(e.target.value) || 0 })}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How are you feeling today?"
                  rows={3}
                />
              </div>

              <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckinSection;













