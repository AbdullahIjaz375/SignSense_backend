const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

const dashboardController = require("../controllers/dashboard");

router.get("/load-users", dashboardController.loadUsers);

router.post("/add-friend", dashboardController.addFriend);

router.get("/:userEmail", dashboardController.loadUsers);

module.exports = router;
