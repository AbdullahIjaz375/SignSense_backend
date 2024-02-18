const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

const dashboardController = require("../controllers/dashboard");

router.post("/add-friend", dashboardController.addFriend);

router.get("/load-friends/:userEmail", dashboardController.loadFriends);

router.post("/remove-friend", dashboardController.removeFriend);

module.exports = router;
