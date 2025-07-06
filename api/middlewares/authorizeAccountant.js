const jwt = require("jsonwebtoken");
const config = require("../config/config");

const authorizeAccountant = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret_key");
    if (decoded.role !== "accountant" && decoded.role !== "institute_admin") {
      return res.status(403).json({ message: "Access denied. Accountant or Institute Admin access required." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("invalid token q");
    return res.status(401).json({ message: "Invalid token wq" });
  }
};

module.exports = authorizeAccountant; 