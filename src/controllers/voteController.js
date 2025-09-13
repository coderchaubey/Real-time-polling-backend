const prisma = require("../db");
let io;

/**
 * Attach Socket.IO instance for broadcasting
 */
exports.attachIO = (socketIO) => {
  io = socketIO;
};

/**
 * Cast a vote and broadcast updated results
 */
exports.castVote = async (req, res) => {
  try {
    const { userId, pollOptionId } = req.body;

    if (!userId || !pollOptionId) {
      return res
        .status(400)
        .json({ error: "userId and pollOptionId are required." });
    }

    // Record vote
    const vote = await prisma.vote.create({
      data: {
        user: { connect: { id: userId } },
        pollOption: { connect: { id: pollOptionId } },
      },
      include: { pollOption: { include: { poll: true } } },
    });

    // Get updated results for the poll
    const pollId = vote.pollOption.poll.id; //Getting the pollId to which our pollOption is connected to
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: { include: { votes: true } } }, //Getting all the options and their corresponding casted votes
    });

    if (!poll) {
      return res.status(404).json({ error: "Poll not found after voting." });
    }

    // Generating only the options data
    const results = poll.options.map((opt) => ({
      optionId: opt.id,
      option: opt.text,
      votes: opt.votes.length, //Length gives us the number of votes
    }));

    const responsePayload = {
      pollId: poll.id,
      question: poll.question,
      results,
    };

    // Broadcast results to all clients subscribed to this poll
    // Broadcast to poll-specific room
    io.to(`poll:${pollId}`).emit("voteUpdate", responsePayload);

    res.json(responsePayload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
