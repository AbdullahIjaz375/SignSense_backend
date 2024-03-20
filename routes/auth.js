const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { upload } = require("../index");

const authController = require("../controllers/auth");

router.post("/sign-up", upload.single("profilePic"), authController.signUp);

router.post("/login", authController.login);

module.exports = router;
