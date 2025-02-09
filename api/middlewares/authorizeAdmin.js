const User = require("../models/User");

const authorizeAdmin = async (req, res, next) => {
  const userId = req.user.userId; // Get the user ID from the request

  try {
    const user = await User.findByPk(userId, { include: [Role] });

    if (!user || !user.Roles.some(role => role.name === "super_admin" || role.name === "institute_admin")) {
      return res.status(403).json({ message: "You are not authorized to perform this action." });
    }

    // User is authorized
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error checking authorization.", error });
  }
};

module.exports = { authorizeAdmin };
