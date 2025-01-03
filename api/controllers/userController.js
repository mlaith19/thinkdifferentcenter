const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/errorHandler");

// توليد التوكن
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, userType: user.userType },
    process.env.JWT_SECRET || "jwt_secret_key",
    { expiresIn: "1h" }
  );
};

// إنشاء حساب جديد
const createUser = async (req, res) => {
  const { username, email, password, fullName, userType, instituteId } = req.body;
  const creator = req.user;

  try {
    if (userType === "super_admin" ) {
      return res.status(403).json({ message: "What are you doing?" });
    }
    if (userType === "institute_admin" && creator.userType !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can create institute admins." });
    }

    if (
      creator.userType === "institute_admin" &&
      userType !== "student" &&
      userType !== "teacher" &&
      userType !== "secretary"
    ) {
      return res
        .status(403)
        .json({ message: "Institute admins can only create institute-related accounts." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      userType,
      instituteId: creator.userType === "institute_admin" ? creator.instituteId : instituteId,
    });

    res.status(201).json({
      message: "User created successfully.",
      user: { id: newUser.id, username: newUser.username, email: newUser.email, fullName: newUser.fullName },
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// تسجيل الدخول
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);
    res.status(200).json({ message: "Login successful.", token,userType: user.userType, });
  } catch (error) {
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// تسجيل الخروج
const logoutUser = async (req, res) => {
  try {
    // للتسجيل الخروج يتم عادةً حذف التوكن من العميل
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    res.status(statusCode).json({ message: errorMessage, errorDetails });  }
};

// حذف المستخدم
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const requester = req.user;

  try {
    const userToDelete = await User.findByPk(userId);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      requester.userType !== "super_admin" &&
      (userToDelete.userType === "institute_admin" || userToDelete.userType === "super_admin")
    ) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this user." });
    }

    await userToDelete.destroy();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  deleteUser,
};
