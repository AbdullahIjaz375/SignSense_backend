const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messages");

const multerMiddleware = require("../middleware/MulterMiddleware");
const uploadToFirebase = require("../middleware/UploadMiddleware");

router.post(
  "/send",
  multerMiddleware.single("voiceMessage"),
  uploadToFirebase,
  messageController.sendMessage
);

router.post("/update", messageController.updateMessage);

router.post("/delete", messageController.deleteMessage);

router.post("/convert-to-asl/:id", messageController.convertToAsl);

module.exports = router;
