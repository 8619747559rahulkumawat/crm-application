const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  alternateNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['New Lead', 'Interested', 'Call Later', 'Meeting Scheduled', 'Follow-Up Pending', 'Converted', 'Not Interested'],
    default: 'New Lead'
  },
  followUpDateTime: {
    type: Date,
    default: null
  },
  leadSource: {
    type: String,
    enum: ['Website', 'Referral', 'Social Media', 'Cold Call', 'Email', 'Other'],
    default: 'Other'
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

clientSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Client', clientSchema);
