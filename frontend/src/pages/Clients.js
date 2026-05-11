import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  MapPin,
  Edit,
  Trash2
} from 'lucide-react';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [leadSourceFilter, setLeadSourceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [searchTerm, statusFilter, leadSourceFilter, dateFilter, fetchClients]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (leadSourceFilter) params.append('leadSource', leadSourceFilter);
      if (dateFilter) params.append('date', dateFilter);

      const response = await api.get(`/clients?${params.toString()}`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await api.delete(`/clients/${clientId}`);
        setClients(clients.filter(client => client._id !== clientId));
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

  const getLeadSourceColor = (leadSource) => {
    const colors = {
      'Website': 'bg-blue-100 text-blue-800',
      'Referral': 'bg-green-100 text-green-800',
      'Social Media': 'bg-purple-100 text-purple-800',
      'Cold Call': 'bg-yellow-100 text-yellow-800',
      'Email': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[leadSource] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return 'Not scheduled';
    return new Date(dateTime).toLocaleString();
  };

  const isToday = (dateTime) => {
    if (!dateTime) return false;
    const today = new Date();
    const followUpDate = new Date(dateTime);
    return today.toDateString() === followUpDate.toDateString();
  };

  const isOverdue = (dateTime) => {
    if (!dateTime) return false;
    return new Date(dateTime) < new Date();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setLeadSourceFilter('');
    setDateFilter('');
  };

  return (
    <div className="space-y-1 sm:space-y-2 lg:space-y-3">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-700">Farmers Management</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">Shri Shyam Krishi Yantra Udyog Client Portal</p>
        </div>
        <Link
          to="/clients/new"
          className="btn btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Add Client</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {(statusFilter || leadSourceFilter || dateFilter) && (
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All Statuses</option>
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
                  value={leadSourceFilter}
                  onChange={(e) => setLeadSourceFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">Follow-up Date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clients List */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || leadSourceFilter || dateFilter
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first client'}
            </p>
            {!searchTerm && !statusFilter && !leadSourceFilter && !dateFilter && (
              <div className="mt-6">
                <Link
                  to="/clients/new"
                  className="btn btn-primary"
                >
                  <Plus className="h-5 w-5 inline mr-2" />
                  Add Client
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow-up
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Source
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client._id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {client.fullName}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{client.address}, {client.city}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {client.phoneNumber}
                      </div>
                      {client.alternateNumber && (
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                          {client.alternateNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className={`text-xs sm:text-sm ${isToday(client.followUpDateTime) ? 'text-warning-600 font-medium' : isOverdue(client.followUpDateTime) ? 'text-danger-600' : 'text-gray-900'}`}>
                        {formatDate(client.followUpDateTime)}
                      </div>
                      {isToday(client.followUpDateTime) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-100 text-warning-800 mt-1">
                          Today
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLeadSourceColor(client.leadSource)}`}>
                        {client.leadSource}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/clients/${client._id}`}
                          className="btn btn-primary p-2 text-xs"
                          title="Edit Client"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteClient(client._id)}
                          className="btn btn-danger p-2 text-xs"
                          title="Delete Client"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
