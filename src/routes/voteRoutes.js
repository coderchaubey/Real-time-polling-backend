const express = require("express");
const { castVote } = require("../controllers/voteController");

const router = express.Router();

router.post("/castvote", castVote);

module.exports = router;
