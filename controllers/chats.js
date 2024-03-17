const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");

async function loadChat(req, res) {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.find({ chatId: chatId })
      .select("-__v")
      .lean();

    // Modify each message object to change 'sender' to 'senderId'
    messages.forEach((message) => {
      message.senderId = message.sender;
      delete message.sender;
    });

    return res
      .status(200)
      .json({ message: "Messages for the chat found", data: messages });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteChat(req, res) {
  try {
    const chatId = req.body.chatId;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const deletedMessages = await Message.deleteMany({ chatId });

    await Chat.findByIdAndDelete(chatId);

    // const io = req.app.get("io");
    // io.emit("chatDeleted", { chatId, deletedMessages });

    return res.status(200).json({
      message: "Chat and associated messages deleted successfully",
      data: { chatId, deletedMessages },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  loadChat,
  deleteChat,
};
