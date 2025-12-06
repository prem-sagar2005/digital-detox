import { Calendar, MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const TripCard = ({ trip, onClick, onUpdate }) => {
  const [imageError, setImageError] = useState(false);
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'ongoing': return 'var(--warning)';
      case 'upcoming': return 'var(--primary)';
      case 'planned': return 'var(--primary)';
      case 'cancelled': return 'var(--danger)';
      default: return 'var(--gray)';
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      completed: 'badge-success',
      ongoing: 'badge-warning',
      upcoming: 'badge-primary',
      planned: 'badge-primary',
      cancelled: 'badge-danger'
    };
    return classes[status] || 'badge-primary';
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await axios.delete(`/trips/${trip.tripID}`);
        onUpdate();
      } catch (error) {
        console.error('Failed to delete trip:', error);
        alert('Failed to delete trip');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const derivedStatus = trip.derivedStatus || trip.status;

  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {/* Status Badge */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <span className={`badge ${getStatusBadge(derivedStatus)}`}>
          {derivedStatus.charAt(0).toUpperCase() + derivedStatus.slice(1)}
        </span>
      </div>

      {/* Cover Image or Gradient */}
      {trip.coverImage ? (
        trip.coverImage.startsWith('http') && !imageError ? (
          <img
            src={trip.coverImage}
            alt={trip.destination}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '200px',
            background: trip.coverImage.startsWith('linear-gradient') ? trip.coverImage : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={64} color="white" style={{ opacity: 0.5 }} />
          </div>
        )
      ) : (
        <div style={{
          width: '100%',
          height: '200px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <MapPin size={64} color="white" style={{ opacity: 0.5 }} />
        </div>
      )}

      {/* Trip Info */}
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {trip.destination}
      </h3>

      <div className="flex" style={{ gap: '1rem', marginBottom: '1rem' }}>
        <div className="flex" style={{ alignItems: 'center', gap: '0.5rem', color: 'var(--gray)' }}>
          <Calendar size={16} />
          <span style={{ fontSize: '0.875rem' }}>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>
      </div>

      {trip.description && (
        <p className="text-muted" style={{
          marginBottom: '1rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {trip.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex-between" style={{
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)'
      }}>
        <div className="flex" style={{ gap: '1rem', fontSize: '0.875rem', color: 'var(--gray)' }}>
          <span>{trip.Checkins?.length || 0} Check-ins</span>
          <span>{trip.Itineraries?.length || 0} Activities</span>
          <span>{trip.Rules?.length || 0} Rules</span>
        </div>
        <button
          className="btn-danger btn-sm"
          onClick={handleDelete}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default TripCard;





