const User = require("../models/user");
const sendResponse = require("../utils/responseFormatter");

async function getUser(req, res) {
  try {
    const userEmail = req.params.userEmail;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      sendResponse(res, 404, null, "User not found.");
      return;
    }

    sendResponse(res, 200, user, "User profile retrieved successfully.");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
}

async function deleteUser(req, res) {
  try {
    const userEmail = req.body.userEmail;

    const user = await User.findOneAndDelete({ email: userEmail });

    if (!user) {
      sendResponse(res, 404, null, "User not found.");
      return;
    }

    sendResponse(res, 200, user, "User profile deleted successfully.");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
}

async function isOnline(req, res) {
  try {
    const userEmail = req.params.userEmail;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      sendResponse(res, 404, null, "User not found.");
      return;
    }

    sendResponse(res, 200, user.isOnline, "User online status received.");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
}

async function changeOnlineStatus(req, res) {
  try {
    const userEmail = req.body.userEmail;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      sendResponse(res, 404, null, "User not found.");
      return;
    }

    if (user.isOnline === "Online") {
      user.isOnline = "Offline";
    } else {
      user.isOnline = "Online";
    }

    await user.save();

    sendResponse(res, 200, user, "User status updated.");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.query.userId;

    const user = await User.findById(userId);

    if (!user) {
      sendResponse(res, 404, null, "User not found.");
      return;
    }

    sendResponse(res, 200, user, "User profile found.");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
}

async function getLoggedInUser(req, res) {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      sendResponse(res, 404, null, "User not found.");
      return;
    }

    sendResponse(res, 200, user, "User profile found.");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
}

async function setUserDescription(req, res) {
  try {
    const { description } = req.body;
    const userEmail = req.user.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      sendResponse(res, 404, null, "User not found.");
      return;
    }

    user.description = description;

    await user.save();

    sendResponse(res, 200, user, "User profile updated.");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    delete updates.userId;
    delete updates.friends;

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, updates, {
      new: true,
    });

    if (!updatedUser) {
      sendResponse(res, 404, null, "User not found.");
      return;
    }

    sendResponse(res, 200, updatedUser, "User profile updated.");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
}

async function searchUser(req, res) {
  try {
    const userName = req.query.userName;

    const users = await User.find({
      name: { $regex: userName, $options: "i" },
    });

    if (!users || users.length === 0) {
      sendResponse(
        res,
        404,
        null,
        "No users found matching the given criteria."
      );
      return;
    }

    sendResponse(res, 200, users, "User profiles retrieved successfully.");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
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
  searchUser,
};
