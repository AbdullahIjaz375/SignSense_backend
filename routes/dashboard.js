const express = require('express')
const router = express.Router();
const isAuth = require('../middleware/isAuth')

const dashboardController = require('../controllers/dashboard')

router.post('/addFriend', dashboardController.addFriend)

router.get('/:userEmail', dashboardController.loadUsers)

router.get('/', (req, res) => {
    console.log("Default route")
});


module.exports = router;