const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chats");
const isAuth = require("../middleware/isAuthMiddleware");

const multerMiddleware = require("../middleware/MulterMiddleware");
const uploadToFirebase = require("../middleware/UploadMiddleware");

router.get("/load-chat/:chatId", chatController.loadChat);

router.post("/delete-chat", chatController.deleteChat);

router.get("/load-all-chats", chatController.loadAllChats);

router.get("/search-chat", chatController.searchChat);

router.post("/create-chat/:receiverId", isAuth, chatController.createChat);

// Updated to use multerMiddleware and uploadToFirebase
router.post(
  "/create-group-chat",
  isAuth,
  multerMiddleware.single("chatPhoto"),
  uploadToFirebase,
  chatController.createGroupChat
);

router.get("/get-chat-data", chatController.getChatData);

module.exports = router;
