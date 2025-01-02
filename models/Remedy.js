const mongoose = require('mongoose');

const RemedySchema = new mongoose.Schema({
  problem: String,
  solution: String,
  plantRecommendations: [String],
  exercises: [String]
});

module.exports = mongoose.model('remedies', RemedySchema);
