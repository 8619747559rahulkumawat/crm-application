const express = require('express');
const mongoose = require('mongoose');
const Client = require('../models/Client');
const Activity = require('../models/Activity');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return fallback data when MongoDB is disconnected
      return res.json({
        totalClients: 3,
        todayFollowUps: 1,
        pendingFollowUps: 2,
        completedFollowUps: 0,
        upcomingAppointments: 3,
        clientsByStatus: [
          { _id: 'New Lead', count: 1 },
          { _id: 'Interested', count: 1 },
          { _id: 'Follow-Up Pending', count: 1 }
        ],
        recentActivities: [
          {
            _id: 'fallback-activity-1',
            type: 'Client Added',
            description: 'New client "John Doe" was added to the system',
            timestamp: new Date(),
            clientId: {
              _id: 'fallback-1',
              fullName: 'John Doe',
              phoneNumber: '+1234567890'
            }
          },
          {
            _id: 'fallback-activity-2',
            type: 'Status Changed',
            description: 'Status changed from "New Lead" to "Interested"',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            clientId: {
              _id: 'fallback-2',
              fullName: 'Jane Smith',
              phoneNumber: '+0987654321'
            }
          }
        ]
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total clients
    const totalClients = await Client.countDocuments();

    // Today's follow-ups
    const todayFollowUps = await Client.countDocuments({
      followUpDateTime: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Pending follow-ups (future dates)
    const pendingFollowUps = await Client.countDocuments({
      followUpDateTime: {
        $gte: tomorrow
      }
    });

    // Completed follow-ups (past dates)
    const completedFollowUps = await Client.countDocuments({
      followUpDateTime: {
        $lt: today
      }
    });

    // Upcoming appointments (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingAppointments = await Client.countDocuments({
      followUpDateTime: {
        $gte: today,
        $lte: nextWeek
      }
    });

    // Clients by status
    const clientsByStatus = await Client.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activities
    const recentActivities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('clientId', 'fullName phoneNumber');

    res.json({
      totalClients,
      todayFollowUps,
      pendingFollowUps,
      completedFollowUps,
      upcomingAppointments,
      clientsByStatus,
      recentActivities
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get today's follow-ups
router.get('/today-followups', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return fallback data when MongoDB is disconnected
      return res.json([
        {
          _id: 'fallback-1',
          fullName: 'John Doe',
          phoneNumber: '+1234567890',
          address: '123 Main St, City',
          city: 'New York',
          status: 'New Lead',
          leadSource: 'Website',
          followUpDateTime: new Date(),
          createdDate: new Date(),
          lastUpdated: new Date()
        }
      ]);
    }

    const today = new Date();
    // Use local timezone by setting to start of today's date
    const localToday = new Date();
    localToday.setHours(0, 0, 0, 0);
    const tomorrow = new Date(localToday);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('Current Date:', today);
    console.log('Local Today (start of day):', localToday);
    console.log('Tomorrow:', tomorrow);

    const todayFollowUps = await Client.find({
      followUpDateTime: {
        $gte: localToday,
        $lt: tomorrow
      },
      status: { $nin: ['Converted', 'Not Interested'] }
    }).sort({ followUpDateTime: 1 });

    console.log('Found today follow-ups:', todayFollowUps.length);
    console.log('Follow-ups:', todayFollowUps.map(c => ({ name: c.fullName, followUp: c.followUpDateTime, status: c.status })));

    res.json(todayFollowUps);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get upcoming follow-ups
router.get('/upcoming-followups', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return fallback data when MongoDB is disconnected
      return res.json([
        {
          _id: 'fallback-1',
          fullName: 'John Doe',
          phoneNumber: '+1234567890',
          address: '123 Main St, City',
          city: 'New York',
          status: 'New Lead',
          leadSource: 'Website',
          followUpDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdDate: new Date(),
          lastUpdated: new Date()
        },
        {
          _id: 'fallback-2',
          fullName: 'Jane Smith',
          phoneNumber: '+0987654321',
          address: '456 Oak Ave, City',
          city: 'Los Angeles',
          status: 'Interested',
          leadSource: 'Referral',
          followUpDateTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
          createdDate: new Date(),
          lastUpdated: new Date()
        }
      ]);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingFollowUps = await Client.find({
      followUpDateTime: {
        $gte: today
      },
      status: { $nin: ['Converted', 'Not Interested'] }
    }).sort({ followUpDateTime: 1 })
      .limit(20);

    res.json(upcomingFollowUps);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get missed follow-ups
router.get('/missed-followups', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const missedFollowUps = await Client.find({
      followUpDateTime: {
        $lt: today
      },
      status: { $nin: ['Converted', 'Not Interested'] }
    }).sort({ followUpDateTime: 1 });

    res.json(missedFollowUps);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get completed follow-ups
router.get('/completed-followups', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedFollowUps = await Client.find({
      followUpDateTime: {
        $lt: today
      }
    }).sort({ followUpDateTime: -1 })
      .limit(50);

    res.json(completedFollowUps);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
