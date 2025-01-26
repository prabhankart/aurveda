const express = require('express');
const axios = require('axios');
const Plant = require('../models/Plant');

const router = express.Router();

router.post('/geocode', async (req, res) => {
    const { placeName } = req.body;

    if (!placeName) {
        return res.status(400).json({ message: 'Place name is required' });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            const plants = await Plant.find({ origin: placeName }); // Adjust query logic
            res.json({ location, plants });
        } else {
            res.status(400).json({ message: 'Geocoding failed', status: response.data.status });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
