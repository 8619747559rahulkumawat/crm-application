import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Phone,
  MapPin
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [todayFollowUps, setTodayFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, followUpsResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/today-followups')
      ]);
      
      setStats(statsResponse.data);
      setTodayFollowUps(followUpsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
    if (!dateTime) return 'Not scheduled';
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleCallNow = async (clientId, phoneNumber) => {
    try {
      // Make the phone call - use client's actual phone number
      console.log('Calling client number:', phoneNumber);
      
      // Try to make the call immediately
      window.location.href = `tel:${phoneNumber}`;
      
      // Remove client card after call ends (when user returns to page)
      // Use page visibility API to detect when user returns from call
      const handleVisibilityChange = async () => {
        if (!document.hidden) {
          // User returned to the page (call likely ended)
          console.log('User returned from call, removing client card');
          
          // Remove client from dashboard
          setTodayFollowUps(prev => prev.filter(client => client._id !== clientId));
          
          // Update client status to "Converted"
          await api.put(`/clients/${clientId}`, {
            status: 'Converted'
          });
          
          // Refresh dashboard data
          await fetchDashboardData();
          
          // Remove event listener
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
      };
      
      // Add event listener for when user returns from call
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Fallback: If call doesn't work, show the client's number
      setTimeout(() => {
        alert('Please dial: ' + phoneNumber);
      }, 1000);
      
      // Fallback: Remove client after 30 seconds even if visibility doesn't change
      setTimeout(async () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        setTodayFollowUps(prev => prev.filter(client => client._id !== clientId));
        await api.put(`/clients/${clientId}`, {
          status: 'Converted'
        });
        await fetchDashboardData();
      }, 30000); // 30 seconds
      
    } catch (error) {
      console.error('Error making phone call:', error);
      alert('Please dial: ' + phoneNumber);
    }
  };

  const handleCallDone = async (clientId) => {
    try {
      // Update the client status to "Converted" (completed)
      await api.put(`/clients/${clientId}`, {
        status: 'Converted'
      });
      
      // Refresh the dashboard data
      await fetchDashboardData();
    } catch (error) {
      console.error('Error updating follow-up status:', error);
    }
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
      {/* Page Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-700">Shri Shyam Krishi Yantra Udyog</h1>
        <p className="mt-0.5 text-sm sm:text-base text-gray-600">Clients Management Portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
        <div className="card">
          <div className="flex items-center justify-center sm:justify-start lg:justify-start xl:justify-start">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-primary-600" />
            </div>
            <div className="ml-2 sm:ml-4 lg:ml-4 xl:ml-4">
              <p className="text-xs sm:text-sm lg:text-sm xl:text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-lg sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-gray-900">{stats?.totalClients || 0}</p>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-warning-500">
          <div className="flex items-center justify-center sm:justify-start lg:justify-start xl:justify-start">
            <div className="flex-shrink-0">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-warning-600" />
            </div>
            <div className="ml-2 sm:ml-4 lg:ml-4 xl:ml-4">
              <p className="text-xs sm:text-sm lg:text-sm xl:text-sm font-medium text-gray-600">Today Follow-ups</p>
              <p className="text-lg sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-warning-600">{stats?.todayFollowUps || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-center sm:justify-start lg:justify-start xl:justify-start">
            <div className="flex-shrink-0">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-blue-600" />
            </div>
            <div className="ml-2 sm:ml-4 lg:ml-4 xl:ml-4">
              <p className="text-xs sm:text-sm lg:text-sm xl:text-sm font-medium text-gray-600">Pending Follow-ups</p>
              <p className="text-lg sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-blue-600">{stats?.pendingFollowUps || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-center sm:justify-start lg:justify-start xl:justify-start">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-success-600" />
            </div>
            <div className="ml-2 sm:ml-4 lg:ml-4 xl:ml-4">
              <p className="text-xs sm:text-sm lg:text-sm xl:text-sm font-medium text-gray-600">Completed Follow-ups</p>
              <p className="text-lg sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-success-600">{stats?.completedFollowUps || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-center sm:justify-start lg:justify-start xl:justify-start">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-purple-600" />
            </div>
            <div className="ml-2 sm:ml-4 lg:ml-4 xl:ml-4">
              <p className="text-xs sm:text-sm lg:text-sm xl:text-sm font-medium text-gray-600">Upcoming Appointments</p>
              <p className="text-lg sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-purple-600">{stats?.upcomingAppointments || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-center sm:justify-start lg:justify-start xl:justify-start">
            <div className="flex-shrink-0">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-indigo-600" />
            </div>
            <div className="ml-2 sm:ml-4 lg:ml-4 xl:ml-4">
              <p className="text-xs sm:text-sm lg:text-sm xl:text-sm font-medium text-gray-600">Recent Activities</p>
              <p className="text-lg sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-indigo-600">{stats?.recentActivities?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">Today's Follow-ups</h2>
            <span className="bg-warning-100 text-warning-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {todayFollowUps.length} Follow-ups
            </span>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {todayFollowUps.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No follow-ups scheduled for today</p>
            ) : (
              todayFollowUps.map((client) => (
                <div 
                    key={client._id} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => handleCallNow(client._id, client.phoneNumber)}
                  >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                        {client.fullName}
                        <Phone className="h-4 w-4 ml-2 text-green-600" />
                      </h3>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-primary-500" />
                          <span className="font-medium">Phone:</span>
                          <span className="text-gray-900">{client.phoneNumber}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                          <span className="font-medium">City:</span>
                          <span className="text-gray-900">{client.city}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                          <span className="font-medium">Status:</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-primary-500" />
                          <span className="font-medium">Follow-up:</span>
                          <span className="text-gray-900">{formatTime(client.followUpDateTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {client.address && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                        <span className="font-medium">Address:</span>
                        <span className="text-gray-900">{client.address}</span>
                      </div>
                    </div>
                  )}
                  {client.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Notes:</span>
                      <span className="text-gray-900">{client.notes}</span>
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCallNow(client._id, client.phoneNumber);
                      }}
                      className="btn btn-success flex items-center space-x-2 px-3 py-2 text-sm"
                      title="Call Now"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call Now</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCallDone(client._id);
                      }}
                      className="btn btn-primary flex items-center space-x-2 px-3 py-2 text-sm"
                      title="Mark as Called"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Mark as Called</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">Recent Activities</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {!stats?.recentActivities || stats.recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activities</p>
            ) : (
              stats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-primary-600 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                      {activity.clientId && ` - ${activity.clientId.fullName}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Client Status Distribution */}
      {stats?.clientsByStatus && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Status Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {stats.clientsByStatus.map((status) => (
              <div key={status._id} className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status._id)}`}>
                  {status._id}
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">{status.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
