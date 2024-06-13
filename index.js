require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const http = require("http");
// const { initializeSocket } = require("./middleware/SocketMiddleware"); // Import the socket middleware
const multerMiddleware = require("./middleware/MulterMiddleware");
const uploadToFirebase = require("./middleware/UploadMiddleware");

const app = express();
const port = process.env.PORT || 3000;

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

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

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
