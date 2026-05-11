import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Plus } from 'lucide-react';

const AddClient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    notes: '',
    status: 'New Lead',
    leadSource: 'Other',
    followUpDateTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clear any previous errors
      setError('');
      
      // Validate form data
      if (!formData.fullName || !formData.phoneNumber || !formData.city || !formData.address) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      console.log('Submitting form data:', formData);
      const response = await api.post('/clients', formData);
      
      if (response.data) {
        // Success - client added successfully
        navigate('/clients');
      } else {
        // Handle API error response
        setError(response.message || 'Error adding client. Please try again.');
      }
    } catch (error) {
      // Handle network or server errors
      console.error('Error adding client:', error);
      setError(error.response?.data?.message || error.message || 'Error adding client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1 sm:space-y-2 lg:space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/clients')}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Clients</span>
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Client</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">Enter client information to create a new record</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
                        <div>
              <label className="label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="label">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="input"
              rows="2"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input"
              >
                <option value="New Lead">New Lead</option>
                <option value="Interested">Interested</option>
                <option value="Call Later">Call Later</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
                <option value="Follow-Up Pending">Follow-Up Pending</option>
                <option value="Converted">Converted</option>
                <option value="Not Interested">Not Interested</option>
              </select>
            </div>
            <div>
              <label className="label">Lead Source</label>
              <select
                name="leadSource"
                value={formData.leadSource}
                onChange={handleInputChange}
                className="input"
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Email">Email</option>
                <option value="Other">Other</option>
              </select>
            </div>
            </div>

          <div>
            <label className="label">Follow-up Date & Time</label>
            <input
              type="datetime-local"
              name="followUpDateTime"
              value={formData.followUpDateTime}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="input"
              rows="3"
              placeholder="Add any additional notes about this client..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Plus className="h-5 w-5" />
              )}
              <span>Add Client</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
