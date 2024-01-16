const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router();
const authController = require('../controllers/auth')

router.put('/sign-up', authController.signUp)

router.post('/login', authController.login)

module.exports = router;