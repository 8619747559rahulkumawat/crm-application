import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, CheckCircle, MapPin, Calendar, Clock } from 'lucide-react';

const CompletedClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedClients();
  }, []);

  const fetchCompletedClients = async () => {
    try {
      const response = await api.get('/clients?status=Converted');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching completed clients:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-1 sm:space-y-2 lg:space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Completed Clients</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">Clients successfully converted</p>
          </div>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg">
          <span className="font-semibold">{clients.length}</span> Completed
        </div>
      </div>

      {/* Completed Clients List */}
      <div className="card">
        <div className="space-y-4">
          {clients.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No completed clients</h3>
              <p className="mt-2 text-sm text-gray-500">Clients marked as completed will appear here.</p>
            </div>
          ) : (
            clients.map((client) => (
              <div key={client._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{client.fullName}</h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                        <span className="font-medium">City:</span>
                        <span className="text-gray-900 ml-1">{client.city}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                        <span className="font-medium">Status:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-1 ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {client.address && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                      <span className="font-medium">Address:</span>
                      <span className="text-gray-900 ml-1">{client.address}</span>
                    </div>
                  </div>
                )}
                
                {client.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Notes:</span>
                    <span className="text-gray-900 ml-1">{client.notes}</span>
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="font-medium">Created:</span>
                    <span className="text-gray-900 ml-1">{formatDate(client.createdDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="font-medium">Last Updated:</span>
                    <span className="text-gray-900 ml-1">{formatDate(client.lastUpdated)}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => navigate(`/clients/${client._id}`)}
                    className="btn btn-primary text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedClients;
