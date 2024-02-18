const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

const userController = require("../controllers/user");

router.get("/get-user/:userEmail", userController.getUser);

router.post("/delete-user", userController.deleteUser);

router.get("/is-online/:userEmail", userController.isOnline);

router.post("/change-online-status", userController.changeOnlineStatus);

module.exports = router;
