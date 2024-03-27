const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const { aslSigns } = require("../utils/AslSigns");
const inverseMapping = require("../utils/inverseMapping");

async function sendMessage(req, res) {
  try {
    const { senderId, receiverIds, chatId, message } = req.body;
    const isVoiceMessage = req.file ? true : false;

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

    let content;
    if (isVoiceMessage) {
      content = req.file.firebaseUrl;
    } else {
      content = message;
    }

    const newMessage = await Message.create({
      sender: senderId,
      content: content,
      chat: chat._id.toString(),
      isVoiceMessage: isVoiceMessage,
    });

    chat.messages.push(newMessage);
    await chat.save();
    res
      .status(200)
      .json({ message: "Message sent successfully", data: chat.messages });
  } catch (error) {
    console.error("Error sending message:", error);
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

const convertToAsl = async (req, res) => {
  try {
    const { id } = req.params;

    const completeMessages = await Message.findById(id);

    const message = completeMessages.content.toUpperCase();

    const aslMessageUrls = [];

    for (let i = 0; i < message.length; i++) {
      const character = message[i];
      if (character === " ") {
        aslMessageUrls.push(" ");
      } else if (aslSigns.hasOwnProperty(character)) {
        aslMessageUrls.push(aslSigns[character].image);
      } else {
        console.log(`Character '${character}' not found in ASL signs.`);
      }
    }

    const content = aslMessageUrls.join(" ");

    const newAslMessage = await Message.create({
      content: content,
      isAslMessage: true,
      sender: completeMessages.sender,
      chat: completeMessages.chat,
    });

    res.json({
      message: "Message converted to ASL successfully",
      data: newAslMessage,
    });
  } catch (error) {
    console.error("Error converting message to ASL:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

async function convertToText(req, res) {
  try {
    const { id } = req.params;

    // Assuming Message is a model from your database (e.g., MongoDB model)
    const completeMessage = await Message.findById(id);

    if (!completeMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Adjusted regex to correctly handle sequences of three spaces
    const urls = completeMessage.content
      .trim()
      .split(/(?<=\S)( +)(?=\S)|((?<=\S) {3}(?=\S))/);
    const characters = [];
    let isFirstCharacter = true; // Flag to handle capitalization of the first character

    for (const url of urls) {
      if (!url) continue; // Skip empty strings

      if (url === "   ") {
        // Detected a word separator, add a space to the output
        characters.push(" ");
      } else if (inverseMapping[url.trim()]) {
        // Found a valid mapping, add the corresponding character
        let character = inverseMapping[url.trim()];
        if (isFirstCharacter) {
          characters.push(character.toUpperCase()); // Capitalize the first character
          isFirstCharacter = false;
        } else {
          characters.push(character.toLowerCase()); // Subsequent characters are lowercase
        }
      } else {
        console.log(`URL '${url}' does not have a corresponding character.`);
      }
    }

    const textMessage = characters.join("");
    completeMessage.content = textMessage; // Update the message content with the converted text
    await completeMessage.save(); // Save the updated message back to the database

    return res
      .status(200)
      .json({ message: "Message converted to text", data: textMessage });
  } catch (error) {
    console.error("Error converting URLs to text:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  sendMessage,
  updateMessage,
  deleteMessage,
  convertToAsl,
  convertToText,
};
