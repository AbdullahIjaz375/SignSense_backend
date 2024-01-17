const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Import the 'upload' middleware from the 'index.js' file
const { upload } = require('../index');

const authController = require('../controllers/auth');

router.post('/sign-up', upload.single('image'), authController.signUp);

router.post('/login', authController.login);

module.exports = router;
