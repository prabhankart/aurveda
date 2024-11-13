const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientific_name: { type: String, required: true },
  uses: { type: [String], required: true },
  origin: { type: String, required: true },
  description: { type: String, required: true },
  properties: { type: [String] },
  methods_of_use: { type: [String] }
});

const Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;