const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");

async function sendMessage(req, res) {
  try {
    const { senderEmail, receiverEmails, chatId, message } = req.body;

    const sender = await User.findOne({ email: senderEmail });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId).populate("users");
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    } else {
      // If chatId is not provided, find or create a chat based on sender and receiver emails
      const receivers = await User.find({ email: { $in: receiverEmails } });
      if (!receivers || receivers.length !== receiverEmails.length) {
        return res
          .status(404)
          .json({ message: "One or more receivers not found" });
      }

      const receiverIds = receivers.map((receiver) => receiver._id);
      chat = await Chat.findOne({
        users: { $all: [sender._id, ...receiverIds] },
      }).populate("users");

      if (!chat) {
        chat = await Chat.create({
          users: [sender._id, ...receiverIds],
          messages: [],
        });
      }
    }

    const newMessage = await Message.create({
      sender: sender._id,
      content: message,
      chatId: chat._id,
    });

    chat.messages.push(newMessage);
    await chat.save();

    const io = req.app.get("io");
    chat.users.forEach((user) => {
      io.emit(`message:${user._id}`, { senderId: sender._id, message });
    });

    res.status(200).json({ message: "Message sent successfully", data: chat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateMessage(req, res) {
  try {
    const { messageId, newContent } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { content: newContent },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    const chatId = updatedMessage.chatId;
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId, "messages._id": messageId },
      { $set: { "messages.$.content": newContent } },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const io = req.app.get("io");
    io.emit("messageUpdated", { updatedMessage, updatedChat });

    return res.status(200).json({
      message: "Message and chat updated successfully",
      data: { updatedMessage, updatedChat },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteMessage(req, res) {
  try {
    const messageId = req.body.messageId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await Message.findByIdAndDelete(messageId);

    const chatId = message.chatId;
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { $pull: { messages: { _id: messageId } } },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const io = req.app.get("io");
    io.emit("messageDeleted", { messageId, chatId });

    return res.status(200).json({
      message: "Message deleted successfully",
      data: { messageId, chatId },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  sendMessage,
  updateMessage,
  deleteMessage,
};
