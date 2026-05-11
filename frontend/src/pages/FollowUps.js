import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Phone,
  MapPin,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

const FollowUps = () => {
  const [todayFollowUps, setTodayFollowUps] = useState([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState([]);
  const [missedFollowUps, setMissedFollowUps] = useState([]);
  const [completedFollowUps, setCompletedFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    fetchFollowUpData();
  }, []);

  const fetchFollowUpData = async () => {
    try {
      const [
        todayResponse,
        upcomingResponse,
        missedResponse,
        completedResponse
      ] = await Promise.all([
        api.get('/dashboard/today-followups'),
        api.get('/dashboard/upcoming-followups'),
        api.get('/dashboard/missed-followups'),
        api.get('/dashboard/completed-followups')
      ]);

      setTodayFollowUps(todayResponse.data);
      setUpcomingFollowUps(upcomingResponse.data);
      setMissedFollowUps(missedResponse.data);
      setCompletedFollowUps(completedResponse.data);
    } catch (error) {
      console.error('Error fetching follow-up data:', error);
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

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString();
  };

  const getFollowUpList = () => {
    switch (activeTab) {
      case 'today':
        return todayFollowUps;
      case 'upcoming':
        return upcomingFollowUps;
      case 'missed':
        return missedFollowUps;
      case 'completed':
        return completedFollowUps;
      default:
        return [];
    }
  };

  const tabs = [
    { id: 'today', name: "Today's Follow-ups", count: todayFollowUps.length, icon: Calendar, color: 'warning' },
    { id: 'upcoming', name: 'Upcoming', count: upcomingFollowUps.length, icon: Clock, color: 'primary' },
    { id: 'missed', name: 'Missed', count: missedFollowUps.length, icon: AlertTriangle, color: 'danger' },
    { id: 'completed', name: 'Completed', count: completedFollowUps.length, icon: CheckCircle, color: 'success' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-1 sm:space-y-2 lg:space-y-3">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-700">Visit Management</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">Shri Shyam Krishi Yantra Udyog Follow-up Portal</p>
        </div>
        <button
          onClick={fetchFollowUpData}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div key={tab.id} className={`card border-l-4 border-${tab.color}-500 cursor-pointer ${activeTab === tab.id ? 'ring-2 ring-' + tab.color + '-500' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-8 w-8 text-${tab.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{tab.name}</p>
                  <p className={`text-2xl font-bold text-${tab.color}-600`}>{tab.count}</p>
                </div>
              </div>
            </div>
          );
        })}
        </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2.5 py-0.5 rounded">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Follow-up List */}
      <div className="card">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {getFollowUpList().length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No follow-ups found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'today' ? 'No follow-ups scheduled for today' : 
                 activeTab === 'upcoming' ? 'No upcoming follow-ups' :
                 activeTab === 'missed' ? 'No missed follow-ups' :
                 activeTab === 'completed' ? 'No completed follow-ups' :
                 'No follow-ups found'}
              </p>
            </div>
          ) : (
            getFollowUpList().map((client) => (
              <div key={client._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{client.fullName}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {client.phoneNumber}
                        </div>
                        {client.alternateNumber && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {client.alternateNumber}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {client.address}, {client.city}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Follow-up:</span>
                          <div className="text-gray-900">
                            {formatDate(client.followUpDateTime)} at {formatTime(client.followUpDateTime)}
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Source:</span>
                          <span className="text-gray-900 ml-2">{client.leadSource}</span>
                        </div>
                      </div>
                    </div>

                    {client.notes && (
                      <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Notes:</strong> {client.notes}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Link
                    to={`/clients/${client._id}`}
                    className="btn btn-secondary text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/clients/${client._id}/edit`}
                    className="btn btn-primary text-sm"
                  >
                    Update Follow-up
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowUps;
