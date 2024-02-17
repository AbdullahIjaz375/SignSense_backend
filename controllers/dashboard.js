const User = require("../models/user");

async function loadUsers(req, res) {
  try {
    const userEmail = req.query.userEmail;

    // Find the user by email
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
    const { userEmail, friendEmail } = req.body;

    // Find the user and friend by email
    const user = await User.findOne({ email: userEmail });
    const friend = await User.findOne({ email: friendEmail });

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found." });
    }

    // Check if the friend is already in the user's friends list
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "User is already a friend." });
    }

    // Add the friend to the user's friends list
    user.friends.push(friend._id);
    await user.save();

    return res.status(200).json({
      message: "Friend added successfully.",
      data: { user, friend },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  loadUsers,
  addFriend,
};
