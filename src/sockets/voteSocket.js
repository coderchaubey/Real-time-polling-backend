const { attachIO } = require("../controllers/voteController");


/**
 * Setup Socket.IO handlers for voting system
 */
function setupVoteSocket(io) {
  // attach 'io' so controllers can use it for broadcasting
  attachIO(io);

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    /**
     * Join a poll room so the user receives live updates
     */
    socket.on("joinPoll", (pollId) => {
      if (!pollId || isNaN(pollId)) {
        console.warn(`[Socket] Invalid pollId from ${socket.id}:`, pollId);
        return;
      }
      socket.join(`poll:${pollId}`);
      console.log(`Socket ${socket.id} joined poll:${pollId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = { setupVoteSocket };