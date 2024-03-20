const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chats");
const isAuth = require("../middleware/isAuth");
const { upload } = require("../index");

router.get("/load-chat/:chatId", chatController.loadChat);

router.post("/delete-chat", chatController.deleteChat);

router.get("/load-all-chats", chatController.loadAllChats);

router.get("/search-chat", chatController.searchChat);

router.post("/create-chat/:receiverId", isAuth, chatController.createChat);

router.post(
  "/create-group-chat",
  isAuth,
  upload.single("chatPhoto"),
  chatController.createGroupChat
);

module.exports = router;
