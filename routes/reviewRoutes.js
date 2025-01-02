const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews. Please try again later.' });
  }
});

// POST a review
router.post('/', async (req, res) => {
  const { userName, reviewText, helpfulRating } = req.body;
  if (!userName || !reviewText || !helpfulRating) {
    return res.status(400).json({ message: 'User name and review are required.' });
  }

  try {
    const newReview = new Review({ userName, reviewText, helpfulRating  });
    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review. Please try again later.' });
  }
});

module.exports = router;
