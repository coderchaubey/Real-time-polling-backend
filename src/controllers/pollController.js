const prisma = require("../db");

/**
 * Creates a new Poll with corresponding options
 */
exports.createPoll = async (req, res) => {
  try {
    const { userId, question, options } = req.body; //De-structured json data

    if (!userId || !question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        error: "Poll requires userId, a question, and at least 2 options.",
      });
    }

    // Create Poll + Poll_options
    const poll = await prisma.poll.create({
      data: {
        question,
        isPublished: true,
        creator: {
          connect: { id: userId }, //link poll to user
        },
        options: {
          create: options.map((text) => ({ text })), //Create multiple options
        },
      },

      include: { options: true },
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: "Failed to create Poll." });
  }
};

/**
 * Get all polls with options and creator info
 */
exports.getPolls = async (req, res) => {
  try {
    const polls = await prisma.poll.findMany({
      include: { options: true, creator: { select: { id: true, name: true } } },
    });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch polls." });
  }
};

/**
 * Get a single poll with results
 */
exports.getUniquePolls = async (req, res) => {
  const pollId = parseInt(req.params.id);

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        include: {
          votes: true,
        },
      },
    },
  });

  if (!poll) return res.status(404).json({ error: "Poll not found" });

  try {
    // Transform into option: count
    const results = poll.options.map((opt) => ({
      optionId: opt.id,
      option: opt.text,
      votes: opt.votes.length,
    }));

    res.json({ pollId: poll.id, question: poll.question, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
