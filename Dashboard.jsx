import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Calendar, MapPin, TrendingUp } from 'lucide-react';
import TripCard from '../components/TripCard';
import CreateTripModal from '../components/CreateTripModal';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    ongoing: 0,
    upcoming: 0
  });

  const navigate = useNavigate();

  const pageBackgroundStyle = {
    backgroundColor: '#fff9da',
    minHeight: 'calc(100vh - 64px)',
    padding: '2rem 0'
  };

  const containerStyle = {
    padding: '2rem 1.5rem',
    backgroundColor: '#fffef4',
    borderRadius: '1.5rem',
    boxShadow: '0 12px 32px rgba(245, 200, 90, 0.2)'
  };

  const sectionCardStyle = {
    backgroundColor: '#fff7cc',
    border: '1px solid #f5d76e',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 10px 20px rgba(245, 198, 66, 0.15)'
  };

  const emptyStateStyle = {
    padding: '4rem 2rem',
    backgroundColor: '#fff7cc',
    border: '1px dashed #f5d76e',
    borderRadius: '1rem',
    color: 'var(--gray)',
    textAlign: 'center'
  };

  const normalizeDate = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    parsed.setHours(0, 0, 0, 0);
    return parsed;
  };

  const categorizeTrips = (tripsList, referenceDate = new Date()) => {
    const today = new Date(referenceDate);
    today.setHours(0, 0, 0, 0);

    return tripsList.reduce(
      (acc, trip) => {
        const startDate = normalizeDate(trip.startDate);
        const endDate = normalizeDate(trip.endDate);
        let category = 'upcoming';

        if (startDate && endDate) {
          if (today >= startDate && today <= endDate) {
            category = 'ongoing';
          } else if (today > endDate) {
            category = 'completed';
          } else if (today < startDate) {
            category = 'upcoming';
          }
        }

        acc[category].push({
          ...trip,
          derivedStatus: category
        });
        return acc;
      },
      { ongoing: [], completed: [], upcoming: [] }
    );
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get('/trips');
      const tripsData = response.data.trips;
      setTrips(tripsData);

      const categorized = categorizeTrips(tripsData);
      setStats({
        total: tripsData.length,
        completed: categorized.completed.length,
        ongoing: categorized.ongoing.length,
        upcoming: categorized.upcoming.length
      });
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTripCreated = () => {
    setShowModal(false);
    fetchTrips();
  };

  if (loading) {
    return (
      <div
        style={{ ...pageBackgroundStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  const categorizedTrips = categorizeTrips(trips);

  const renderTripSection = (title, tripList) => {
    if (tripList.length === 0) {
      return null;
    }

    return (
      <section className="mb-4" style={sectionCardStyle}>
        <div className="flex-between mb-2">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h2>
        </div>
        <div className="grid grid-2">
          {tripList.map(trip => (
            <TripCard
              key={trip.tripID}
              trip={trip}
              onClick={() => navigate(`/trip/${trip.tripID}`)}
              onUpdate={fetchTrips}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div style={pageBackgroundStyle}>
      <div className="container" style={containerStyle}>
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            My Trips
          </h1>
          <p className="text-muted">Plan and track your digital detox journeys</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          New Trip
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-3 mb-4">
        <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div className="flex-between">
            <div>
              <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Total Trips</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.total}</h2>
            </div>
            <TrendingUp size={48} style={{ opacity: 0.5 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <div className="flex-between">
            <div>
              <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Ongoing</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.ongoing}</h2>
            </div>
            <MapPin size={48} style={{ opacity: 0.5 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <div className="flex-between">
            <div>
              <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Completed</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.completed}</h2>
            </div>
            <Calendar size={48} style={{ opacity: 0.5 }} />
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <div style={emptyStateStyle}>
          <MapPin size={64} style={{ margin: '0 auto 1rem', color: '#f0ad4e', opacity: 0.6 }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#a87407' }}>No trips yet</h2>
          <p className="text-muted mb-3">Create your first digital detox trip to get started</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div>
          {renderTripSection('Ongoing Trips', categorizedTrips.ongoing)}
          {renderTripSection('Completed Trips', categorizedTrips.completed)}
          {renderTripSection('Upcoming Trips', categorizedTrips.upcoming)}
        </div>
      )}

      {/* Create Trip Modal */}
      {showModal && (
        <CreateTripModal
          onClose={() => setShowModal(false)}
          onSuccess={handleTripCreated}
        />
      )}
      </div>
    </div>
  );
};

export default Dashboard;






