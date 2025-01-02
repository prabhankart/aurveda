const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userName: String,
  reviewText: String,
  helpfulRating: Number,
});

module.exports = mongoose.model('reviews', ReviewSchema);
