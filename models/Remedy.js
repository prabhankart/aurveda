const mongoose = require('mongoose');

const RemedySchema = new mongoose.Schema({
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  plantRecommendations: { type: [String], required: true },
  exercises: { type: [String], required: true },
});

module.exports = mongoose.model('Remedy', RemedySchema);
