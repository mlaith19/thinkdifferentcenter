const User = require("../models/User");
const Role = require("../models/role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Utility function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, roleId: user.roleId },
    process.env.JWT_SECRET || "jwt_secret_key",
    { expiresIn: "1h" }
  );
};

// Create a new user (signup)
const createUser = async (req, res) => {
  const { username, email, password, fullName } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = await Role.findOne({ where: { name: "user" } });

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      roleId: userRole.id,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: "User created successfully.",
      user: { id: newUser.id, username: newUser.username, email: newUser.email, fullName: newUser.fullName },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user.", error });
  }
};

module.exports = { createUser };
