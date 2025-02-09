require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // for serving static files like images

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images from the "uploads" directory
// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const plantRoutes = require('./routes/plantRoutes');
const remedyRoutes = require('./routes/remedyRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const excerciseRoutes = require('./routes/excerciseRoutes');

// Use routes
app.use('/plants', plantRoutes);
app.use('/remedies', remedyRoutes);
app.use('/reviews', reviewRoutes);  // Reviews route for handling review submission
app.use('/excercise', excerciseRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Virtual Herbal Garden');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
