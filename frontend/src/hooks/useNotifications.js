import { useState, useEffect } from 'react';
import api from '../services/api';

export const useNotifications = () => {
  const [todayFollowUps, setTodayFollowUps] = useState([]);
  const [missedFollowUps, setMissedFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Set up interval for real-time updates (every 5 minutes)
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [todayResponse, missedResponse] = await Promise.all([
        api.get('/dashboard/today-followups'),
        api.get('/dashboard/missed-followups')
      ]);
      
      setTodayFollowUps(todayResponse.data);
      setMissedFollowUps(missedResponse.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgentCount = () => {
    return todayFollowUps.length + missedFollowUps.length;
  };

  const getTodayCount = () => {
    return todayFollowUps.length;
  };

  const getMissedCount = () => {
    return missedFollowUps.length;
  };

  return {
    todayFollowUps,
    missedFollowUps,
    loading,
    getUrgentCount,
    getTodayCount,
    getMissedCount,
    refreshNotifications: fetchNotifications
  };
};
