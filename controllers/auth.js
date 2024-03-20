const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const multer = require("multer");
const isAuth = require("../middleware/isAuth");

async function signUp(req, res) {
  const { email, name, password, accountType, signLanguagePreference } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken." });
    }

    const defaultProfilePic = "/images/default-profile-pic.jpg";

    const profilePic = req.file ? req.file.path : defaultProfilePic;

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

    const token = jwt.sign({ userId: newUser._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "User created successfully.",
      data: { User: newUser.toObject(), token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

    if (isPasswordMatch) {
      const token = jwt.sign(
        { userId: foundUser._id, email: foundUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "14w" }
      );

      res.status(200).json({
        message: "Login successful",
        data: { User: foundUser, token },
      });
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
