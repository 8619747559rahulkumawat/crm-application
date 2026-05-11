import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    mobileNumber: ''
  });

  useEffect(() => {
    fetchClientData();
  }, [id, fetchClientData]);

  const fetchClientData = async () => {
    try {
      const [clientResponse, activitiesResponse] = await Promise.all([
        api.get(`/clients/${id}`),
        api.get(`/clients/${id}/activities`)
      ]);
      
      setClient(clientResponse.data);
      setFormData(clientResponse.data);
      setActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/clients/${id}`, formData);
      setClient(response.data);
      setEditing(false);
      await fetchClientData(); // Refresh activities
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const deleteClient = async () => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await api.delete(`/clients/${id}`);
        navigate('/clients');
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'New Lead': 'bg-blue-100 text-blue-800',
      'Interested': 'bg-green-100 text-green-800',
      'Call Later': 'bg-yellow-100 text-yellow-800',
      'Meeting Scheduled': 'bg-purple-100 text-purple-800',
      'Follow-Up Pending': 'bg-orange-100 text-orange-800',
      'Converted': 'bg-emerald-100 text-emerald-800',
      'Not Interested': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return 'Not scheduled';
    return new Date(dateTime).toLocaleString();
  };

  const getActivityIcon = (type) => {
    const icons = {
      'Client Added': CheckCircle,
      'Follow-Up Updated': Calendar,
      'Notes Added': Activity,
      'Status Changed': Clock,
      'Call Scheduled': Phone
    };
    return icons[type] || Activity;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-medium text-gray-900">Client not found</h3>
        <p className="mt-1 text-sm text-gray-500">The client you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 sm:space-y-2 lg:space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate('/clients')}
            className="btn btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Back to Clients</span>
          </button>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{client.fullName}</h1>
            <p className="mt-1 text-gray-600 text-sm sm:text-base">Client Details</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          {!editing && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="btn btn-warning flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Edit</span>
              </button>
              <button
                onClick={deleteClient}
                className="btn btn-danger flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Client Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h2>
            
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
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
                    <label className="label">Phone Number</label>
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
                    <label className="label">City</label>
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
                  <label className="label">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input"
                    rows="2"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input"
                      required
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
                      required
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
                    value={formData.followUpDateTime ? new Date(formData.followUpDateTime).toISOString().slice(0, 16) : ''}
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
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {client.phoneNumber}
                      </div>
                      {client.mobileNumber && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {client.mobileNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {client.address}
                      </div>
                      <div className="text-sm text-gray-900 ml-6">
                        {client.city}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status & Source</h3>
                    <div className="mt-2 space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                      <div className="text-sm text-gray-900">
                        Source: {client.leadSource}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Follow-up</h3>
                    <div className="mt-2 flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(client.followUpDateTime)}
                    </div>
                  </div>
                </div>

                {client.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-2 text-sm text-gray-900">{client.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(client.createdDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(client.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activities recorded</p>
              ) : (
                activities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
