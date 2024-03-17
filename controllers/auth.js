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
    // Check if email is already taken
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken." });
    }

    // Create a new user
    const newUser = new User({
      email: email,
      name: name,
      password: password,
      accountType: accountType,
      signLanguagePreference:
        accountType === "2" ? null : signLanguagePreference,
    });

    // Save the new user to the database
    await newUser.save();

    res
      .status(200)
      .json({ message: "User created successfully.", data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function login(req, res) {
  try {
    // Extract user credentials from the request body
    const { email, password } = req.body;

    // Find the user by email
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

    if (isPasswordMatch) {
      const token = jwt.sign(
        { userId: foundUser._id, email: foundUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const loadedUser = { foundUser, token };
      res.status(200).json({ message: "Login successful", data: loadedUser });
    } else {
      // Passwords do not match
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  signUp,
  login,
};
