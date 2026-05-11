import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, AlertTriangle, Calendar, X } from 'lucide-react';

const Notifications = () => {
  const { todayFollowUps, missedFollowUps, getUrgentCount, getTodayCount, getMissedCount } = useNotifications();

  if (getUrgentCount() === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-warning-600" />
            <h3 className="font-semibold text-gray-900">Follow-up Reminders</h3>
          </div>
          <span className="bg-warning-100 text-warning-800 text-xs font-medium px-2 py-1 rounded-full">
            {getUrgentCount()}
          </span>
        </div>
        
        <div className="space-y-2">
          {getTodayCount() > 0 && (
            <div className="flex items-center space-x-2 p-2 bg-warning-50 rounded">
              <Calendar className="h-4 w-4 text-warning-600" />
              <span className="text-sm text-warning-800">
                {getTodayCount()} follow-up{getTodayCount() > 1 ? 's' : ''} today
              </span>
            </div>
          )}
          
          {getMissedCount() > 0 && (
            <div className="flex items-center space-x-2 p-2 bg-danger-50 rounded">
              <AlertTriangle className="h-4 w-4 text-danger-600" />
              <span className="text-sm text-danger-800">
                {getMissedCount()} missed follow-up{getMissedCount() > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Check your dashboard for details
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
