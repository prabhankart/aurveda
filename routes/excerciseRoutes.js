const express = require('express');
const Joi = require('joi');
const Excercise = require('../models/Excercise');
const router = express.Router();
// Joi schema for validation
const excerciseValidationSchema = Joi.object({
  excercise: Joi.string().required(),
 
});
// POST a new excercise
router.post('/', async (req, res) => {
    const { error } = excerciseValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
  
    try {
      const excercise = new Excercise(req.body);
      const savedExcercise = await excercise.save();
      res.status(201).json(savedExcercise);
    } catch (err) {
      res.status(500).json({ message: 'Error creating plant. Please try again later.' });
    }
  });
  
  module.exports = router;
  