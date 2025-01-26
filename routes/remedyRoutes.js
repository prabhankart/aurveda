const express = require('express');
const Remedy = require('../models/Remedy');
const router = express.Router();

// GET remedies based on health issue
router.get('/', async (req, res) => {
  const { issue } = req.query;
  if (!issue) {
    return res.status(400).json({ message: 'Health issue is required.' });
  }

  try {
    const remedies = await Remedy.find({
      problem: { $regex: `^${issue}$`, $options: 'i' },
    });
    if (remedies.length > 0) {
      res.json(remedies);
    } else {
      res.status(404).json({ message: `No remedies found for ${issue}` });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch remedies. Please try again later.' });
  }
});


// POST a new remedy
router.post('/', async (req, res) => {
  const { problem, solution, plantRecommendations, exercises } = req.body;
  if (!problem || !solution || !plantRecommendations || !exercises) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const remedy = new Remedy({ problem, solution, plantRecommendations, exercises });
    const savedRemedy = await remedy.save();
    res.status(201).json(savedRemedy);
  } catch (err) {
    res.status(500).json({ message: 'Error creating remedy. Please try again later.' });
  }
});

module.exports = router;
