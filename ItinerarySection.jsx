import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Clock, MapPin, CheckCircle, Circle, X } from 'lucide-react';

const ItinerarySection = ({ tripId }) => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    day: 1,
    activity: '',
    time: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchItineraries();
  }, [tripId]);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get(`/itineraries/trip/${tripId}`);
      setItineraries(response.data.itineraries);
    } catch (error) {
      console.error('Failed to fetch itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/itineraries', { ...formData, tripID: parseInt(tripId) });
      setShowModal(false);
      setFormData({ day: 1, activity: '', time: '', location: '', description: '' });
      fetchItineraries();
    } catch (error) {
      console.error('Failed to create itinerary:', error);
      alert('Failed to create activity');
    }
  };

  const toggleComplete = async (itinerary) => {
    try {
      await axios.put(`/itineraries/${itinerary.itineraryID}`, {
        isCompleted: !itinerary.isCompleted
      });
      fetchItineraries();
    } catch (error) {
      console.error('Failed to update itinerary:', error);
    }
  };

  const handleDelete = async (itineraryId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await axios.delete(`/itineraries/${itineraryId}`);
        fetchItineraries();
      } catch (error) {
        console.error('Failed to delete itinerary:', error);
      }
    }
  };

  // Group itineraries by day
  const groupedItineraries = itineraries.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {});

  if (loading) {
    return <div className="flex-center"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Trip Itinerary</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Add Activity
        </button>
      </div>

      {itineraries.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 2rem' }}>
          <Clock size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray)', opacity: 0.5 }} />
          <p className="text-muted">No activities planned yet. Start building your itinerary!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.keys(groupedItineraries).sort((a, b) => a - b).map(day => (
            <div key={day} className="card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>
                Day {day}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {groupedItineraries[day].map(item => (
                  <div
                    key={item.itineraryID}
                    style={{
                      padding: '1rem',
                      background: item.isCompleted ? 'var(--light)' : 'white',
                      border: '2px solid var(--border)',
                      borderRadius: '0.5rem',
                      opacity: item.isCompleted ? 0.7 : 1
                    }}
                  >
                    <div className="flex-between mb-2">
                      <div className="flex" style={{ alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        <button
                          onClick={() => toggleComplete(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: item.isCompleted ? 'var(--success)' : 'var(--gray)',
                            padding: 0
                          }}
                        >
                          {item.isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
                        </button>
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            textDecoration: item.isCompleted ? 'line-through' : 'none'
                          }}>
                            {item.activity}
                          </h4>
                        </div>
                      </div>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => handleDelete(item.itineraryID)}
                        style={{ padding: '0.25rem 0.5rem' }}
                      >
                        Delete
                      </button>
                    </div>

                    <div className="flex" style={{ gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--gray)' }}>
                      {item.time && (
                        <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={16} />
                          <span>{item.time}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={16} />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-muted" style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Itinerary Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Activity</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Day</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Activity</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  placeholder="e.g., Morning yoga on the beach"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time (Optional)</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Sunset Beach"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about this activity..."
                  rows={3}
                />
              </div>

              <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItinerarySection;













