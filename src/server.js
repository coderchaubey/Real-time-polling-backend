const http = require("http");
const express = require("express");
const app = require("./app"); // Express app with routes
const path = require("path");
const { setupVoteSocket } = require("./sockets/voteSocket");

const server = http.createServer(app); // Wrap Express app in HTTP server
const { Server } = require("socket.io");

// Socket.IO instance for real-time communication
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins
});

// Setup socket handlers
setupVoteSocket(io);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../public")));

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});