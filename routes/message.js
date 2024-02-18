const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messages");

router.post("/send", messageController.sendMessage);

router.post("/update", messageController.updateMessage);

router.post("/delete", messageController.deleteMessage);

module.exports = router;
