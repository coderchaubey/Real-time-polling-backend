const prisma = require("../db");
const bcrypt = require("bcryptjs");

/**
 * Creates a new user
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; //Getting the request

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email }, // hide hash
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user." });
  }
};

/**
 * Get all the registered Users
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }, // excluding passwordHash
    });

    if(!users){
      return res.status(400).json({ error: "No registered Users found!" });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};