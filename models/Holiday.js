const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  reason: String
});


module.exports = mongoose.models.Earnings || mongoose.model('Holiday', holidaySchema);
