const express = require('express');
const path = require('path');
const Review = require('../models/Review');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews. Please try again later.' });
  }
});

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Dynamically create a folder based on the user's name or ID
    const userFolder = path.join(__dirname, '../uploads', req.body.userName); // Corrected path

    // Check if the folder exists, if not, create it
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    cb(null, userFolder); // Store the file in the user's folder
  },
  filename: (req, file, cb) => {
    // Save the file with a timestamp and original file extension
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); // Filename with extension
  },
});

const upload = multer({ storage });

// POST route for submitting a review with an image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { userName, reviewText, helpfulRating } = req.body;
    const imageUrl = req.file ? `/uploads/${userName}/${req.file.filename}` : ''; // Store the image path dynamically

    const newReview = new Review({
      userName,
      reviewText,
      helpfulRating,
      imageUrl,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully!', review: newReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

module.exports = router;
