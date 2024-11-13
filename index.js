require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Joi = require('joi');
const app = express();

app.use(cors());
app.use(express.json());

// Import models
const Plant = require('./models/Plant');
const Review = require('./models/Review');

// Joi schema for validating plants
const plantValidationSchema = Joi.object({
  name: Joi.string().required(),
  scientific_name: Joi.string().required(),
  uses: Joi.array().items(Joi.string()).required(),
  origin: Joi.string().required(),
  description: Joi.string().required(),
  properties: Joi.array().items(Joi.string()),
  methods_of_use: Joi.array().items(Joi.string())
});

// GET route for fetching plants with optional filters
app.get('/plants', async (req, res) => {
  const { property, method, name } = req.query;

  let query = {};
  if (property) query.properties = { $in: [property] };
  if (method) query.methods_of_use = { $in: [method] };
  if (name) query.name = { $regex: name, $options: 'i' };

  try {
    const plants = await Plant.find(query);
    res.json(plants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch plants. Please try again later.' });
  }
});

// POST route for creating a new plant
app.post('/plants', async (req, res) => {
  const { name, scientific_name, uses, origin, description, properties, methods_of_use } = req.body;

  // Validate input using Joi
  const { error } = plantValidationSchema.validate({ name, scientific_name, uses, origin, description, properties, methods_of_use });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const plant = new Plant({ name, scientific_name, uses, origin, description, properties, methods_of_use });
    const savedPlant = await plant.save();
    res.status(201).json(savedPlant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating plant. Please try again later.' });
  }
});

// GET route to fetch all reviews
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reviews. Please try again later.' });
  }
});

// POST route to submit a review
app.post('/reviews', async (req, res) => {
  const { userName, review } = req.body;

  // Simple validation for review input
  if (!userName || !review) {
    return res.status(400).json({ message: 'User name and review are required.' });
  }

  try {
    const newReview = new Review({ userName, review });
    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting review. Please try again later.' });
  }
});

// POST route to handle health queries
app.post('/health-query', async (req, res) => {
  const { issue } = req.body;

  if (!issue) {
    return res.status(400).json({ message: 'No issue provided' });
  }

  const parsedQuery = parseHealthQuery(issue);
  if (parsedQuery) {
    try {
      const remedies = await fetchHealthRemedies(parsedQuery);

      if (remedies.length > 0) {
        return res.json({ remedies });
      } else {
        return res.json({ message: `No remedies found for ${issue}` });
      }
    } catch (error) {
      console.error('Error fetching remedies:', error);
      return res.status(500).json({ message: 'Failed to fetch health remedies' });
    }
  } else {
    return res.status(400).json({ message: 'Unable to parse the health issue' });
  }
});

// Simple health query parsing function
function parseHealthQuery(query) {
  const healthIssues = ['nausea', 'joint pain', 'headache', 'cold', 'stomach ache'];
  return healthIssues.find(issue => query.toLowerCase().includes(issue));
}

// Dummy function to fetch health remedies (to be replaced by actual implementation)
async function fetchHealthRemedies(query) {
  // Replace with actual database/API logic to retrieve remedies
  return [{ remedy: 'Herbal tea', details: 'Good for relaxation and stomach ache.' }];
}

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Virtual Herbal Garden');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
