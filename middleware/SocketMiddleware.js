const socketIo = require("socket.io");

let io;

function initializeSocket(server, app) {
  try {
    io = socketIo(server);

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("message", (data) => {
        console.log("Message received:", data);
        socket.broadcast.emit("message", data);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    // Set io on the application object
    app.set("io", io);
    console.log("Socket.io initialized");
  } catch (error) {
    console.error("Error initializing Socket.io:", error);
    throw error;
  }
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

module.exports = { initializeSocket, getIo };
