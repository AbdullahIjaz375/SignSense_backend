require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const http = require("http"); // Require http module for Socket.io
// const { initializeSocket } = require("./middleware/SocketMiddleware"); // Import the socket middleware

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@signsense.gwc86sr.mongodb.net/dev`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Middleware to parse JSON
app.use(express.json());

// Middleware to serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./public/uploads"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

module.exports.upload = upload;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io middleware
// initializeSocket(server, app);

// Routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const chatRoutes = require("./routes/chats");
const userRoutes = require("./routes/user");
const messagesRoutes = require("./routes/message");

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/chats", chatRoutes);
app.use("/user", userRoutes);
app.use("/messages", messagesRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
