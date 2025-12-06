import { useState } from 'react';
import axios from 'axios';
import { X, MapPin, Calendar } from 'lucide-react';
import { indianTouristDestinations, getDestinationByName } from '../data/touristDestinations';

const CreateTripModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    coverImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [isCustomDestination, setIsCustomDestination] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentFallback, setCurrentFallback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/trips', formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectedState(value);
    
    // Check if user selected custom destination
    if (value === 'CUSTOM') {
      setIsCustomDestination(true);
      setFormData({
        ...formData,
        destination: '',
        coverImage: ''
      });
    } else {
      setIsCustomDestination(false);
      // Reset destination when state changes
      setFormData({
        ...formData,
        destination: '',
        coverImage: ''
      });
    }
  };

  const handleDestinationChange = (e) => {
    const destinationName = e.target.value;
    const destination = getDestinationByName(destinationName);
    
    setImageError(false);
    setFormData({
      ...formData,
      destination: destinationName,
      coverImage: destination ? destination.image : ''
    });
    setCurrentFallback(destination ? destination.fallback : '');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Trip</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <MapPin size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Select State/UT
            </label>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="form-select"
              required
            >
              <option value="">-- Choose a State/Union Territory --</option>
              {Object.keys(indianTouristDestinations).sort().map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
              <option value="CUSTOM" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                ✏️ Enter Custom Destination
              </option>
            </select>
          </div>

          {isCustomDestination ? (
            <>
              <div className="form-group">
                <label className="form-label">
                  <MapPin size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                  Enter Destination Name
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Bali, Indonesia or My Secret Hideout"
                  required
                />
                <small style={{ color: 'var(--gray)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                  Enter any destination - perfect for international or lesser-known places!
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL (Optional)</label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
                <small style={{ color: 'var(--gray)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                  Leave blank for a beautiful gradient background
                </small>
              </div>
            </>
          ) : (
            selectedState && (
              <div className="form-group">
                <label className="form-label">
                  <MapPin size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                  Select Tourist Destination
                </label>
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleDestinationChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose a Destination --</option>
                  {indianTouristDestinations[selectedState].map(dest => (
                    <option key={dest.name} value={dest.name}>
                      {dest.name}
                    </option>
                  ))}
                </select>
              </div>
            )
          )}

          {formData.coverImage && !isCustomDestination && (
            <div className="form-group">
              <label className="form-label">Destination Preview</label>
              {!imageError ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={formData.coverImage}
                    alt={formData.destination}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem',
                      border: '2px solid var(--border)',
                      display: imageError ? 'none' : 'block'
                    }}
                    onError={() => {
                      setImageError(true);
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    background: currentFallback,
                    borderRadius: '0.5rem',
                    border: '2px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MapPin size={96} color="white" style={{ opacity: 0.5 }} />
                </div>
              )}
            </div>
          )}

          {formData.coverImage && isCustomDestination && formData.coverImage.startsWith('http') && (
            <div className="form-group">
              <label className="form-label">Image Preview</label>
              <img
                src={formData.coverImage}
                alt={formData.destination}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                  border: '2px solid var(--border)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Calendar size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe your digital detox journey..."
              rows={3}
            />
          </div>

          <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;





