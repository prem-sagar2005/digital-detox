import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Star, ThumbsUp, ThumbsDown, X } from 'lucide-react';

const ReviewsSection = ({ tripId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    reviewText: '',
    detoxSuccess: true
  });

  useEffect(() => {
    fetchReviews();
  }, [tripId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/reviews/trip/${tripId}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/reviews', { ...formData, tripID: parseInt(tripId) });
      setShowModal(false);
      setFormData({ rating: 5, reviewText: '', detoxSuccess: true });
      fetchReviews();
    } catch (error) {
      console.error('Failed to create review:', error);
      alert('Failed to create review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`/reviews/${reviewId}`);
        fetchReviews();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        fill={i < rating ? 'var(--warning)' : 'none'}
        color={i < rating ? 'var(--warning)' : 'var(--gray)'}
      />
    ));
  };

  if (loading) {
    return <div className="flex-center"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Trip Reviews</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Add Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 2rem' }}>
          <Star size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray)', opacity: 0.5 }} />
          <p className="text-muted">No reviews yet. Share your experience!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(review => (
            <div key={review.reviewID} className="card">
              <div className="flex-between mb-2">
                <div className="flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {review.User?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600' }}>
                      {review.User?.fullName || review.User?.username}
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => handleDelete(review.reviewID)}
                  style={{ padding: '0.25rem 0.5rem' }}
                >
                  Delete
                </button>
              </div>

              <div className="flex" style={{ gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <div className="flex" style={{ gap: '0.25rem' }}>
                  {renderStars(review.rating)}
                </div>
                <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                  {review.detoxSuccess ? (
                    <>
                      <ThumbsUp size={18} color="var(--success)" />
                      <span style={{ color: 'var(--success)', fontWeight: '500', fontSize: '0.875rem' }}>
                        Detox Successful
                      </span>
                    </>
                  ) : (
                    <>
                      <ThumbsDown size={18} color="var(--danger)" />
                      <span style={{ color: 'var(--danger)', fontWeight: '500', fontSize: '0.875rem' }}>
                        Needs Improvement
                      </span>
                    </>
                  )}
                </div>
              </div>

              {review.reviewText && (
                <p style={{ lineHeight: '1.6', color: 'var(--dark)' }}>
                  {review.reviewText}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Review Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Review</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="flex" style={{ gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem'
                      }}
                    >
                      <Star
                        size={32}
                        fill={star <= formData.rating ? 'var(--warning)' : 'none'}
                        color={star <= formData.rating ? 'var(--warning)' : 'var(--gray)'}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-muted" style={{ fontSize: '0.875rem' }}>
                  {formData.rating} out of 5 stars
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  className="form-textarea"
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  placeholder="Share your digital detox experience..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.detoxSuccess}
                    onChange={(e) => setFormData({ ...formData, detoxSuccess: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>My digital detox was successful</span>
                </label>
              </div>

              <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;













