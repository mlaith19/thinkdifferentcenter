// middlewares/authorizeSuperAdmin.js
const User = require("../models/User");

const authorizeSuperAdmin = async (req, res, next) => {
  const userId = req.user.userId; // Assuming `req.user` contains the authenticated user data

  try {
    const user = await User.findByPk(userId); // Find the user by ID

    if (!user || user.role !== "super_admin") {
      return res.status(403).json({ message: "You are not authorized to perform this action." });
    }

    // If user is super admin, proceed to the next middleware or controller
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking authorization.", error });
  }
};

module.exports = { authorizeSuperAdmin };
