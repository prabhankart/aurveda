const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userName: String,
  reviewText: String,
  helpfulRating: Number,
  imageUrl: String, // To store the image URL
});

module.exports = mongoose.model('reviews', ReviewSchema);
