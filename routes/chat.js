const express = require('express');
const router = express.Router();
const Remedy = require('../models/Remedy');

router.post('/', async (req, res) => {
  const { problem } = req.body;
  const remedy = await Remedy.findOne({ problem: problem.toLowerCase() });

  if (remedy) {
    res.json({
      solution: remedy.solution,
      plantRecommendations: remedy.plantRecommendations,
      exercises: remedy.exercises
    });
  } else {
    res.json({ solution: 'Sorry, no remedies found for this problem.' });
  }
});

module.exports = router;
