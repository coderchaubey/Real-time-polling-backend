const express = require("express");
const userRoutes = require("./routes/userRoutes");
const pollRoutes = require("./routes/pollRoutes");
const voteRoutes = require("./routes/voteRoutes");

const app = express();
app.use(express.json()); //To parse JSON bodies

// Routes
app.use("/users", userRoutes);
app.use("/polls", pollRoutes);
app.use("/votes", voteRoutes);

module.exports = app;
