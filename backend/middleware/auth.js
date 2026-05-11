const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Check if MongoDB is connected and handle fallback authentication
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected, use normal authentication
      const admin = await Admin.findById(decoded.id).select('-password');
      
      if (!admin) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      
      req.admin = admin;
    } else {
      // MongoDB is disconnected, use fallback authentication
      if (decoded.id === 'fallback-admin') {
        req.admin = {
          _id: 'fallback-admin',
          username: 'admin',
          createdAt: new Date()
        };
      } else {
        return res.status(401).json({ message: 'Token is not valid' });
      }
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
