const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chats");

router.get("/load-chat/:chatId", chatController.loadChat);

router.post("/delete-chat", chatController.deleteChat);

module.exports = router;
