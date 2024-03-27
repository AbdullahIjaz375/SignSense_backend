const User = require("../models/user");

async function loadFriends(req, res) {
  try {
    const userEmail = req.query.userEmail;

    const user = await User.findOne({ email: userEmail }).populate("friends");

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.friends.length == 0) {
      return res
        .status(404)
        .json({ message: "This user has not added any friends." });
    }

    return res
      .status(200)
      .json({ message: "All friends returned", data: user.friends });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function addFriend(req, res) {
  try {
    const { friendId } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found." });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "User is already a friend." });
    }

    user.friends.push(friend._id);
    await user.save();

    return res.status(200).json({
      message: "Friend added successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function removeFriend(req, res) {
  try {
    const { friendId } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found." });
    }

    const friendIndex = user.friends.findIndex(
      (f) => f.toString() === friend._id.toString()
    );

    if (friendIndex === -1) {
      return res
        .status(400)
        .json({ message: "This user is not added as a friend." });
    }

    user.friends.splice(friendIndex, 1);

    await user.save();

    return res
      .status(200)
      .json({ message: "Friend removed successfully.", data: friend });
  } catch (error) {
    console.error("Error removing friend:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  loadFriends,
  addFriend,
  removeFriend,
};
