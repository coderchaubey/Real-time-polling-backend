const express = require("express");
const { createUser, getUsers } = require("../controllers/userController");

const router = express.Router();

router.post("/createuser", createUser);
router.get("/", getUsers);

module.exports = router;