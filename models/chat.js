const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      time: {
        type: Date,
        default: Date.now,
      },
      isVoiceMessage: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
  chatPhoto: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
