const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

const userController = require("../controllers/user");

router.get("/get-user/:userEmail", userController.getUser);

router.post("/delete-user", userController.deleteUser);

router.get("/is-online/:userEmail", userController.isOnline);

router.post("/change-online-status", userController.changeOnlineStatus);

router.get("/get-user-by-id", userController.getUserById);

router.get("/get-logged-in-user", isAuth, userController.getLoggedInUser);

router.post("/set-description", isAuth, userController.setUserDescription);

module.exports = router;
