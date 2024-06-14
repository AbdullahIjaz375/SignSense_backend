const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const { aslSigns } = require("../utils/AslSigns");
const { pslSigns } = require("../utils/pslSigns");
const inverseAslMapping = require("../utils/inverseAslMapping");
const inversePslMapping = require("../utils/inversePslMapping");

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
    let completeMessage = await Message.findById(id);

    if (!completeMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    const message = completeMessage.content.toUpperCase();
    const aslMessageUrls = [];

    for (let i = 0; i < message.length; i++) {
      const character = message[i];
      if (character !== " " && aslSigns.hasOwnProperty(character)) {
        aslMessageUrls.push(aslSigns[character].image);
      } else if (character !== " ") {
        console.log(`Character '${character}' not found in ASL signs.`);
      }
    }

    // Send the response with the content as an array of URLs only
    res.json({
      message: "Message converted to ASL successfully",
      data: aslMessageUrls, // Returning only the array of URLs
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

    const completeMessage = await Message.findById(id);

    if (!completeMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Assuming the content is stored as a stringified array
    const urlsArray = JSON.parse(completeMessage.content);

    const characters = [];
    let isFirstCharacter = true;

    for (const url of urlsArray) {
      if (url === " ") {
        // Directly add a space for " " elements in the array
        characters.push(" ");
        isFirstCharacter = true; // Next character should be capitalized as it's the start of a new word
      } else if (inverseAslMapping[url]) {
        // Add the mapped character, uppercase if it's the first character of a word
        characters.push(
          isFirstCharacter
            ? inverseAslMapping[url].toUpperCase()
            : inverseAslMapping[url].toLowerCase()
        );
        isFirstCharacter = false; // Subsequent characters are not the first in a word
      } else {
        console.log(`URL '${url}' does not have a corresponding character.`);
      }
    }

    const textMessage = characters.join("");

    // Assuming you want to update the message content with the converted text
    completeMessage.content = textMessage;
    // await completeMessage.save();

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

const convertTextToAsl = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const message = text.toUpperCase();
    const aslMessageUrls = [];

    for (let i = 0; i < message.length; i++) {
      const character = message[i];
      if (character !== " " && aslSigns.hasOwnProperty(character)) {
        aslMessageUrls.push(aslSigns[character].image);
      } else if (character !== " ") {
        console.log(`Character '${character}' not found in ASL signs.`);
      }
    }

    // Send the response with the content as an array of URLs only
    res.json({
      message: "Text converted to ASL successfully",
      data: aslMessageUrls, // Returning only the array of URLs
    });
  } catch (error) {
    console.error("Error converting text to ASL:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const convertToPsl = async (req, res) => {
  try {
    const { id } = req.params;
    let completeMessage = await Message.findById(id);

    if (!completeMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    const message = completeMessage.content;
    const pslMessageUrls = [];

    for (let i = 0; i < message.length; i++) {
      const character = message[i];
      if (character !== " " && pslSigns.hasOwnProperty(character)) {
        pslMessageUrls.push(pslSigns[character].image);
      } else if (character !== " ") {
        console.log(`Character '${character}' not found in PSL signs.`);
      }
    }

    // Send the response with the content as an array of URLs only
    res.json({
      message: "Message converted to PSL successfully",
      data: pslMessageUrls, // Returning only the array of URLs
    });
  } catch (error) {
    console.error("Error converting message to PSL:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const convertTextToPsl = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const message = text;
    const pslMessageUrls = [];

    for (let i = 0; i < message.length; i++) {
      const character = message[i];
      if (character !== " " && pslSigns.hasOwnProperty(character)) {
        pslMessageUrls.push(pslSigns[character].image);
      } else if (character !== " ") {
        console.log(`Character '${character}' not found in PSL signs.`);
      }
    }

    // Send the response with the content as an array of URLs only
    res.json({
      message: "Text converted to PSL successfully",
      data: pslMessageUrls, // Returning only the array of URLs
    });
  } catch (error) {
    console.error("Error converting text to PSL:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  sendMessage,
  updateMessage,
  deleteMessage,
  convertToAsl,
  convertToText,
  convertTextToAsl,
  convertToPsl,
  convertTextToPsl,
};
