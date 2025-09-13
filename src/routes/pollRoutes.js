const express = require("express");
const { createPoll, getPolls, getUniquePolls } = require("../controllers/pollController");

const router = express.Router();

router.post("/createpoll", createPoll);
router.get("/", getPolls);
router.get("/:id", getUniquePolls);

module.exports = router;