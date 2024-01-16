const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dev')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware to parse JSON
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});