const express = require('express');
const Joi = require('joi');
const Plant = require('../models/Plant');
const router = express.Router();

// Joi schema for validation
const plantValidationSchema = Joi.object({
  name: Joi.string().required(),
  scientific_name: Joi.string().required(),
  uses: Joi.array().items(Joi.string()).required(),
  origin: Joi.string().required(),
  description: Joi.string().required(),
  properties: Joi.array().items(Joi.string()),
  methods_of_use: Joi.array().items(Joi.string())
});

// GET plants with optional filters
router.get('/', async (req, res) => {
  const { property, method, name } = req.query;
  let query = {};
  if (property) query.properties = { $in: [property] };
  if (method) query.methods_of_use = { $in: [method] };
  if (name) query.name = { $regex: name, $options: 'i' };

  try {
    const plants = await Plant.find(query);
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plants. Please try again later.' });
  }
});

// POST a new plant
router.post('/', async (req, res) => {
  const { error } = plantValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const plant = new Plant(req.body);
    const savedPlant = await plant.save();
    res.status(201).json(savedPlant);
  } catch (err) {
    res.status(500).json({ message: 'Error creating plant. Please try again later.' });
  }
});

module.exports = router;
