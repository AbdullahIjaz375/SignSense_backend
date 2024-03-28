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
    const userId = req.user.userId;

    // Fetching all chats that involve the user, populating user details and the latest message
    const chats = await Chat.find({ users: userId })
      .populate({
        path: "users",
        select: "name",
      })
      .populate({
        path: "messages",
        options: { sort: { time: -1 }, limit: 1 }, // Ensuring the latest message is fetched
      });

    if (chats.length === 0) {
      return res
        .status(200)
        .json({ message: "This user is not part of any chats yet." });
    }

    // Formatting each chat with the latest message details
    const formattedChats = chats.map((chat) => {
      const latestMessage = chat.messages.length > 0 ? chat.messages[0] : null;

      return {
        chatId: chat._id,
        chatName: chat.chatName,
        chatPhoto: chat.chatPhoto,
        latestMessage: latestMessage
          ? {
              content: latestMessage.content,
              time: latestMessage.time,
              isVoiceMessage: latestMessage.isVoiceMessage
                ? latestMessage.isVoiceMessage
                : false,
              isAslMessage: latestMessage.isAslMessage
                ? latestMessage.isAslMessage
                : false, // Corrected the conditional check for isAslMessage
            }
          : null,
      };
    });

    // Returning all formatted chats for the user
    res.json({
      message: "All chats for this user returned",
      data: formattedChats,
    });
  } catch (error) {
    console.error("Error loading chats:", error);
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
        chatId: chat._id,
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

async function createChat(req, res) {
  try {
    const senderId = req.user.userId;

    const { receiverId } = req.params;

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    const chatName = receiver.name;
    const chatPhoto = receiver.profilePic;

    const existingChat = await Chat.findOne({
      users: { $all: [senderId, receiverId], $size: 2 },
    });

    if (existingChat) {
      return res
        .status(400)
        .json({ error: "Chat already exists with this user" });
    }

    const newChat = new Chat({
      chatName: chatName,
      users: [senderId, receiverId],
      chatPhoto: chatPhoto,
    });

    await newChat.save();

    const responseData = {
      chatName: newChat.chatName,
      users: newChat.users.filter((userId) => userId !== senderId),
      chatPhoto: newChat.chatPhoto,
      _id: newChat._id,
      __v: newChat.__v,
    };

    res
      .status(200)
      .json({ message: "Chat created successfully", data: responseData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function createGroupChat(req, res) {
  try {
    const senderId = req.user.userId;

    // Extracting chatName, receiverIds, and chatPhoto directly from the request body
    const { chatName, receiverIds, chatPhoto } = req.body;

    // Validating chatName and chatPhoto presence
    if (!chatName || !chatPhoto) {
      return res
        .status(400)
        .json({ error: "Chat name and chat photo are required" });
    }

    // Validating receiverIds as an array with at least two elements
    if (!Array.isArray(receiverIds) || receiverIds.length < 2) {
      return res.status(400).json({
        error:
          "User IDs should be provided as an array with at least two elements",
      });
    }

    // Checking if all user IDs exist
    const users = await User.find({ _id: { $in: receiverIds } });
    if (users.length !== receiverIds.length) {
      return res
        .status(400)
        .json({ error: "One or more provided user IDs do not exist" });
    }

    // Adding the sender to the list of chat participants
    receiverIds.push(senderId);

    // Checking for existing chats with the same users
    const existingChatsWithSameUsers = await Chat.findOne({
      users: { $all: receiverIds, $size: receiverIds.length },
    });
    if (existingChatsWithSameUsers) {
      return res
        .status(400)
        .json({ error: "Chat already exists with the same set of users" });
    }

    // Creating the new chat document
    const newChat = new Chat({
      chatName,
      users: receiverIds,
      chatPhoto, // Using the chatPhoto URL directly from the request
    });

    await newChat.save();

    // Preparing user IDs for the response, excluding the sender
    const responseReceiverIds = receiverIds.filter((id) => id !== senderId);

    // Sending response with chat creation details
    res.status(200).json({
      message: "Group chat created successfully",
      data: { chatName, users: responseReceiverIds, chatPhoto },
    });
  } catch (error) {
    console.error("Error creating group chat:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getChatData(req, res) {
  try {
    const { chatId } = req.query;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ message: "No chat found for this chat ID" });
    }

    res.status(200).json({ message: "Chat found.", data: chat });
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
  createChat,
  createGroupChat,
  getChatData,
};
