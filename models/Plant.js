const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientific_name: { type: String, required: true },
  uses: { type: [String], required: true },
  origin: { type: String, required: true },
  location: {
    type: [Number], // Expecting an array of two numbers
    required: true,
  },
  
  description: { type: String, required: true },
  properties: { type: [String] },
  methods_of_use: { type: [String] }
});

const Plant = mongoose.model('plants', plantSchema);
module.exports = Plant;
