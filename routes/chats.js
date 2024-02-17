const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chats");

router.post("/send", chatController.sendMessage);

router.get("/load-chat/:chatId", chatController.loadChat);

module.exports = router;
