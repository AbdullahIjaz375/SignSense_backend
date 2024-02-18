const User = require("../models/user");

async function getUser(req, res) {
  try {
    const userEmail = req.params.userEmail;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function deleteUser(req, res) {
  try {
    const userEmail = req.body.userEmail;

    const user = await User.findOneAndDelete({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User Account deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function isOnline(req, res) {
  try {
    const userEmail = req.params.userEmail;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "No user found." });
    }

    return res
      .status(200)
      .json({ message: "Status received", data: user.isOnline });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function changeOnlineStatus(req, res) {
  try {
    const userEmail = req.body.userEmail;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "No user found." });
    }

    if (user.isOnline === "Online") {
      user.isOnline = "Offline";
    } else {
      user.isOnline = "Online";
    }

    await user.save();

    return res.status(200).json({ message: "User Status Updated", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  getUser,
  deleteUser,
  isOnline,
  changeOnlineStatus,
};