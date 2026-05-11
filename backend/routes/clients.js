const express = require('express');
const { body, validationResult } = require('express-validator');
const Client = require('../models/Client');
const Activity = require('../models/Activity');

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const { search, status, leadSource, date } = req.query;
    let query = {};

    // Search by name or phone
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by lead source
    if (leadSource) {
      query.leadSource = leadSource;
    }

    // Filter by date
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.followUpDateTime = {
        $gte: targetDate,
        $lt: nextDay
      };
    }

    const clients = await Client.find(query).sort({ followUpDateTime: 1, createdDate: -1 });
    res.json(clients);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Add new client
router.post('/', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const client = new Client(req.body);
    await client.save();

    // Log activity
    const activity = new Activity({
      clientId: client._id,
      type: 'Client Added',
      description: `New client "${client.fullName}" was added to the system`
    });
    await activity.save();

    res.json(client);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const previousStatus = client.status;
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Log status change if status changed
    if (previousStatus !== req.body.status) {
      const activity = new Activity({
        clientId: client._id,
        type: 'Status Changed',
        description: `Status changed from "${previousStatus}" to "${req.body.status}"`,
        previousStatus,
        newStatus: req.body.status
      });
      await activity.save();
    }

    // Log follow-up update if follow-up changed
    if (client.followUpDateTime?.toString() !== req.body.followUpDateTime?.toString()) {
      const activity = new Activity({
        clientId: client._id,
        type: 'Follow-Up Updated',
        description: `Follow-up scheduled for ${new Date(req.body.followUpDateTime).toLocaleString()}`
      });
      await activity.save();
    }

    res.json(updatedClient);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await Client.findByIdAndDelete(req.params.id);
    
    // Delete related activities
    await Activity.deleteMany({ clientId: req.params.id });

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


// Get client activities
router.get('/:id/activities', async (req, res) => {
  try {
    const activities = await Activity.find({ clientId: req.params.id })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(activities);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
