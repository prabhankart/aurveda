const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

router.post('/', async (req, res) => {
  const { userName, reviewText, helpfulRating } = req.body;
  const newReview = new Review({ userName, reviewText, helpfulRating });
  await newReview.save();
  res.json({ message: 'Review submitted successfully!' });
});

module.exports = router;
