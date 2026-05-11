const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  type: {
    type: String,
    enum: ['Client Added', 'Follow-Up Updated', 'Notes Added', 'Status Changed', 'Call Scheduled'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  previousStatus: {
    type: String
  },
  newStatus: {
    type: String
  }
});

module.exports = mongoose.model('Activity', activitySchema);
