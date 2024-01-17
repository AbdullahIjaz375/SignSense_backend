const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './public/images'))
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name)
  }
})

const upload = multer({ storage: storage })

module.exports.upload = upload;

// Routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require("./routes/dashboard")


app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes)

// Default route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});