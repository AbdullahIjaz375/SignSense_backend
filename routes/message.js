const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messages");
const { upload } = require("../index");

router.post("/send", upload.single("chatPhoto"), messageController.sendMessage);

router.post("/update", messageController.updateMessage);

router.post("/delete", messageController.deleteMessage);

module.exports = router;
