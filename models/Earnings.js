const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
  uber: Number,
  ola: Number,
  rapido: Number,
  date: Date
});

module.exports = mongoose.models.Earnings || mongoose.model('Earnings', earningsSchema);
