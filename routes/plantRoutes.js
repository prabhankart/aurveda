const express = require('express');
const Joi = require('joi');
const axios = require('axios');
const Plant = require('../models/Plant');

const router = express.Router();
// Joi schema for validation
const plantValidationSchema = Joi.object({
  name: Joi.string().required(),
  scientific_name: Joi.string().required(),
  uses: Joi.array().items(Joi.string()).required(),
  origin: Joi.string().required(),
  location: Joi.string().required(), // New field for location
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
//
router.get('/location', async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ message: 'Location is required' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const placeName = response.data.results[0].formatted_address;

      const plants = await Plant.find({ origin: { $regex: placeName, $options: 'i' } });
      if (plants.length === 0) {
        return res.status(404).json({ message: `No plants found for location: ${placeName}` });
      }

      res.json({ location: placeName, plants });
    } else {
      res.status(400).json({
        message: 'Invalid location. Please provide a valid place name.',
        suggestion: 'Ensure the location is spelled correctly or provide a more specific address.'
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plants for the given location. Please try again later.' });
  }
});


module.exports = router;
