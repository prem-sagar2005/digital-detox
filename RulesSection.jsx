import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Shield, ToggleLeft, ToggleRight, X } from 'lucide-react';

const RulesSection = ({ tripId }) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ruleName: '',
    description: '',
    ruleType: 'custom',
    isActive: true
  });

  useEffect(() => {
    fetchRules();
  }, [tripId]);

  const fetchRules = async () => {
    try {
      const response = await axios.get(`/rules/trip/${tripId}`);
      setRules(response.data.rules);
    } catch (error) {
      console.error('Failed to fetch rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/rules', { ...formData, tripID: parseInt(tripId) });
      setShowModal(false);
      setFormData({ ruleName: '', description: '', ruleType: 'custom', isActive: true });
      fetchRules();
    } catch (error) {
      console.error('Failed to create rule:', error);
      alert('Failed to create rule');
    }
  };

  const toggleActive = async (rule) => {
    try {
      await axios.put(`/rules/${rule.ruleID}`, {
        isActive: !rule.isActive
      });
      fetchRules();
    } catch (error) {
      console.error('Failed to update rule:', error);
    }
  };

  const handleDelete = async (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await axios.delete(`/rules/${ruleId}`);
        fetchRules();
      } catch (error) {
        console.error('Failed to delete rule:', error);
      }
    }
  };

  const getRuleTypeColor = (type) => {
    const colors = {
      device_free_zones: 'var(--danger)',
      time_limits: 'var(--warning)',
      app_restrictions: 'var(--primary)',
      emergency_only: 'var(--success)',
      custom: 'var(--secondary)'
    };
    return colors[type] || 'var(--gray)';
  };

  if (loading) {
    return <div className="flex-center"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Device Rules</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Add Rule
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 2rem' }}>
          <Shield size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray)', opacity: 0.5 }} />
          <p className="text-muted">No rules set yet. Define your digital detox boundaries!</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {rules.map(rule => (
            <div
              key={rule.ruleID}
              className="card"
              style={{
                opacity: rule.isActive ? 1 : 0.6,
                borderLeft: `4px solid ${getRuleTypeColor(rule.ruleType)}`
              }}
            >
              <div className="flex-between mb-2">
                <div className="flex" style={{ alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <Shield size={24} color={getRuleTypeColor(rule.ruleType)} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', flex: 1 }}>
                    {rule.ruleName}
                  </h3>
                </div>
                <button
                  onClick={() => toggleActive(rule)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: rule.isActive ? 'var(--success)' : 'var(--gray)',
                    padding: 0
                  }}
                >
                  {rule.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              <span
                className="badge"
                style={{
                  backgroundColor: getRuleTypeColor(rule.ruleType),
                  color: 'white',
                  marginBottom: '0.75rem'
                }}
              >
                {rule.ruleType.replace(/_/g, ' ').toUpperCase()}
              </span>

              {rule.description && (
                <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                  {rule.description}
                </p>
              )}

              <div className="flex-between">
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => handleDelete(rule.ruleID)}
                  style={{ padding: '0.25rem 0.5rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Rule Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Device Rule</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Rule Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.ruleName}
                  onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                  placeholder="e.g., No phones at dinner"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rule Type</label>
                <select
                  className="form-select"
                  value={formData.ruleType}
                  onChange={(e) => setFormData({ ...formData, ruleType: e.target.value })}
                  required
                >
                  <option value="device_free_zones">Device-Free Zones</option>
                  <option value="time_limits">Time Limits</option>
                  <option value="app_restrictions">App Restrictions</option>
                  <option value="emergency_only">Emergency Only</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this rule in detail..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Active immediately</span>
                </label>
              </div>

              <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesSection;













