const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuthMiddleware");

const dashboardController = require("../controllers/dashboard");

router.post("/add-friend", dashboardController.addFriend);

router.get("/load-friends", dashboardController.loadFriends);

router.post("/remove-friend", dashboardController.removeFriend);

module.exports = router;
