const mongoose = require('mongoose');
const ExcerciseSchema = new mongoose.Schema({
  excercise: { type: String, required: true },
  
});

const Excercise = mongoose.model('excercises', ExcerciseSchema);
module.exports = Excercise;
