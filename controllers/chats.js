const Chat = require("../models/chat");

async function sendMessage(req, res) {
  try {
    const { senderId, receiverIds, message } = req.body;

    if (!Array.isArray(receiverIds)) {
      return res.status(400).json({ message: "receiverIds must be an array" });
    }

    let createdChats = [];

    for (const receiverId of receiverIds) {
      let existingChat = await Chat.findOne({
        sender_id: senderId,
        receiver_id: receiverId,
      });

      if (existingChat) {
        existingChat.messages.push(message);
        await existingChat.save();
        createdChats.push(existingChat);
      } else {
        let newChat = await Chat.create({
          sender_id: senderId,
          receiver_id: receiverId,
          messages: [message],
        });
        createdChats.push(newChat);
      }

      const io = req.app.get("io");
      io.emit(`message:${receiverId}`, { senderId, message });
    }

    res
      .status(200)
      .json({ message: "Message sent successfully", chats: createdChats });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function loadChat(req, res) {
  try {
    const chatId = req.params.chatId;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "No previous chats found" });
    }

    return res.status(200).json({ message: "Previous Chat found", chat: chat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  sendMessage,
  loadChat,
};
