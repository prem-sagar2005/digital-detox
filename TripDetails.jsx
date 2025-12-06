import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Calendar, Edit2, Plus } from 'lucide-react';
import CheckinSection from '../components/CheckinSection';
import ItinerarySection from '../components/ItinerarySection';
import RulesSection from '../components/RulesSection';
import ReviewsSection from '../components/ReviewsSection';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await axios.get(`/trips/${id}`);
      setTrip(response.data.trip);
      setEditData({
        destination: response.data.trip.destination,
        description: response.data.trip.description,
        status: response.data.trip.status
      });
      setImageError(false);
    } catch (error) {
      console.error('Failed to fetch trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/trips/${id}`, editData);
      setIsEditing(false);
      fetchTrip();
    } catch (error) {
      console.error('Failed to update trip:', error);
      alert('Failed to update trip');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'ongoing': return 'var(--warning)';
      case 'planned': return 'var(--primary)';
      case 'cancelled': return 'var(--danger)';
      default: return 'var(--gray)';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <h2>Trip not found</h2>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Back Button */}
      <button
        className="btn btn-outline btn-sm mb-3"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Trip Header */}
      <div className="card mb-3">
        {trip.coverImage ? (
          trip.coverImage.startsWith('http') && !imageError ? (
            <img
              src={trip.coverImage}
              alt={trip.destination}
              onError={() => setImageError(true)}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '300px',
              background: trip.coverImage.startsWith('linear-gradient') ? trip.coverImage : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin size={96} color="white" style={{ opacity: 0.5 }} />
            </div>
          )
        ) : (
          <div style={{
            width: '100%',
            height: '300px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={96} color="white" style={{ opacity: 0.5 }} />
          </div>
        )}

        {isEditing ? (
          <div>
            <div className="form-group">
              <label className="form-label">Destination</label>
              <input
                type="text"
                className="form-input"
                value={editData.destination}
                onChange={(e) => setEditData({ ...editData, destination: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              >
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex" style={{ gap: '1rem' }}>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Save Changes
              </button>
              <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex-between mb-2">
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                {trip.destination}
              </h1>
              <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} />
                Edit
              </button>
            </div>

            <div className="flex" style={{ gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="var(--primary)" />
                <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              </div>
              <span className="badge" style={{ backgroundColor: getStatusColor(trip.status), color: 'white' }}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </span>
            </div>

            {trip.description && (
              <p className="text-muted" style={{ lineHeight: '1.6' }}>
                {trip.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="card mb-3">
        <div className="flex" style={{ gap: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0' }}>
          {['overview', 'checkins', 'itinerary', 'rules', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
                color: activeTab === tab ? 'var(--primary)' : 'var(--gray)',
                fontWeight: activeTab === tab ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-2px'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-3">
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Statistics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <p className="text-muted">Check-ins</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {trip.Checkins?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-muted">Activities</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                  {trip.Itineraries?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-muted">Rules</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                  {trip.Rules?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Recent Check-ins
            </h3>
            {trip.Checkins?.slice(0, 3).map(checkin => (
              <div key={checkin.checkinID} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                <div className="flex-between">
                  <span className="badge badge-primary">{checkin.mood}</span>
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {new Date(checkin.checkinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {(!trip.Checkins || trip.Checkins.length === 0) && (
              <p className="text-muted">No check-ins yet</p>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('checkins')}>
                <Plus size={16} />
                Add Check-in
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('itinerary')}>
                <Plus size={16} />
                Add Activity
              </button>
              <button className="btn btn-success btn-sm" onClick={() => setActiveTab('rules')}>
                <Plus size={16} />
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'checkins' && <CheckinSection tripId={id} />}
      {activeTab === 'itinerary' && <ItinerarySection tripId={id} />}
      {activeTab === 'rules' && <RulesSection tripId={id} />}
      {activeTab === 'reviews' && <ReviewsSection tripId={id} />}
    </div>
  );
};

export default TripDetails;





