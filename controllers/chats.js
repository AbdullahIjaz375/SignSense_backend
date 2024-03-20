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

async function loadAllChats(req, res) {
  try {
    const userId = req.query.userId;

    const chats = await Chat.find({ users: userId })
      .populate({
        path: "users",
        select: "name",
      })
      .populate({
        path: "messages",
        options: { sort: { time: -1 }, limit: 1 }, // Limit to only the latest message
      });

    if (chats.length === 0) {
      return res
        .status(200)
        .json({ message: "This user is not part of any chats yet." });
    }

    const formattedChats = chats.map((chat) => ({
      chatName: chat.chatName,
      chatPhoto: chat.chatPhoto,
      latestMessage:
        chat.messages.length > 0
          ? {
              content: chat.messages[chat.messages.length - 1].content,
              time: chat.messages[chat.messages.length - 1].time,
            }
          : null,
    }));

    res.json({
      message: "All chats for this user returned",
      data: formattedChats,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function searchChat(req, res) {
  try {
    const chatName = req.query.chatName;

    // Perform case-insensitive search for chatName
    const regex = new RegExp(chatName, "i");
    const chats = await Chat.find({ chatName: { $regex: regex } });

    const formattedChats = chats.map((chat) => {
      const latestMessage =
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null;
      return {
        chatName: chat.chatName,
        chatPhoto: chat.chatPhoto,
        latestMessage: latestMessage
          ? {
              content: latestMessage.content,
              time: latestMessage.time,
            }
          : null,
      };
    });

    res.json({
      message: "Chats found",
      data: formattedChats,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  loadChat,
  deleteChat,
  loadAllChats,
  searchChat,
};
