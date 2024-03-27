const express = require("express");
const router = express.Router();

const multerMiddleware = require("../middleware/MulterMiddleware");
const uploadToFirebase = require("../middleware/UploadMiddleware");

const authController = require("../controllers/auth");

router.post(
  "/sign-up",
  multerMiddleware.single("profilePic"),
  uploadToFirebase,
  authController.signUp
);

router.post("/login", authController.login);

module.exports = router;
