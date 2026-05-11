const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

const router = express.Router();

// Register Admin (for initial setup)
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Check if admin already exists
    let admin = await Admin.findOne({ username });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    admin = new Admin({ username, password });
    await admin.save();

    // Create JWT token
    const payload = { id: admin.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Login Admin
router.post('/login', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Fallback authentication for when MongoDB is disconnected
      if (username === 'admin' && password === 'admin') {
        const payload = { id: 'fallback-admin' };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
        return res.json({ token });
      }
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = { id: admin.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get authenticated admin
router.get('/me', auth, async (req, res) => {
  try {
    // If MongoDB is disconnected, return fallback admin data
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        _id: 'fallback-admin',
        username: 'admin',
        createdAt: new Date()
      });
    }
    res.json(req.admin);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
