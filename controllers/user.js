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

async function getUserById(req, res) {
  try {
    const userId = req.query.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function getLoggedInUser(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Logged-in user found", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function setUserDescription(req, res) {
  try {
    const { description } = req.body;
    const userEmail = req.user.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.description = description;

    await user.save();

    return res
      .status(200)
      .json({ message: "Description updated successfully", data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    console.log(updates);

    delete updates.userId;
    delete updates.friends;

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  getUser,
  deleteUser,
  isOnline,
  changeOnlineStatus,
  getUserById,
  getLoggedInUser,
  setUserDescription,
  updateUser,
};
