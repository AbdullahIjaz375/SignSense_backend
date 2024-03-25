const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");

async function sendMessage(req, res) {
  try {
    const { senderId, receiverIds, chatId, message } = req.body;

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    } else {
      const receivers = await User.find({ _id: { $in: receiverIds } });
      if (!receivers || receivers.length !== receiverIds.length) {
        return res
          .status(404)
          .json({ message: "One or more receivers not found" });
      }

      chat = await Chat.findOne({
        users: { $all: [senderId, ...receiverIds] },
      });

      if (!chat) {
        return res.status(400).json({
          message:
            "Create a group chat or chat with the users to send messages",
        });
      }
    }

    // Create the message in the database
    const newMessage = await Message.create({
      sender: senderId,
      content: message,
      chatId: chat._id,
    });

    // Add the message to the chat
    chat.messages.push(newMessage);
    await chat.save();

    res
      .status(200)
      .json({ message: "Message sent successfully", data: chat.messages });
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

    // const io = req.app.get("io");
    // io.emit("messageUpdated", { updatedMessage, updatedChat });

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

    // const io = req.app.get("io");
    // io.emit("messageDeleted", { messageId, chatId });

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
