const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const sendResponse = require("../utils/responseFormatter");
const bucket = require("../utils/firebaseAdmin");

async function signUp(req, res) {
  const { email, name, password, accountType, signLanguagePreference } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      sendResponse(res, 400, null, "Email already in use.");
      return;
    }

    const defaultProfilePicUrl = `https://storage.googleapis.com/${bucket.name}/images/default-profile-pic.jpg`;

    const profilePic =
      req.file && req.file.firebaseUrl
        ? req.file.firebaseUrl
        : defaultProfilePicUrl;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;

    const newUser = new User({
      email: email,
      name: name,
      password: password,
      accountType: accountType,
      signLanguagePreference:
        accountType === "2" ? null : signLanguagePreference,
      profilePic: profilePic,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "14w",
    });

    // Exclude password from the response
    const userResponse = { ...newUser._doc, password: undefined, token };

    sendResponse(res, 200, userResponse, "User registered successfully.");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, null, error.message);
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      sendResponse(res, 401, null, "Invalid credentials.");
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

    if (isPasswordMatch) {
      const token = jwt.sign(
        { userId: foundUser._id, email: foundUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "14w" }
      );

      const userResponse = { ...foundUser._doc, password: undefined, token };

      sendResponse(res, 200, userResponse, "User logged in successfully.");
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  signUp,
  login,
};
