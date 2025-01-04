const User = require("../models/User");
const Role = require("../models/role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/errorHandler");

// توليد التوكن
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "jwt_secret_key",
    { expiresIn: "1h" }
  );
};

// إنشاء حساب جديد
const createUser = async (req, res) => {
  const { username, email, password, fullName, roleId, instituteId } = req.body;
  const creator = req.user;

  try {
    // التحقق من أن المستخدم الذي ينشئ الحساب لديه الصلاحية
    const creatorRoles = await creator.getRoles();
    const isSuperAdmin = creatorRoles.some(role => role.name === "super_admin");
    const isInstituteAdmin = creatorRoles.some(role => role.name === "institute_admin");

    if (!isSuperAdmin && !isInstituteAdmin) {
      return res.status(403).json({ message: "You do not have permission to create users." });
    }

    // التحقق من أن البريد الإلكتروني غير مستخدم
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // إنشاء المستخدم
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      instituteId: isInstituteAdmin ? creator.instituteId : instituteId,
    });

    // تعيين الدور للمستخدم
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }
    await newUser.addRole(role);

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
    const user = await User.findOne({ where: { email }, include: [Role] });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);
    res.status(200).json({ message: "Login successful.", token, roles: user.Roles });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// تسجيل الخروج
const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
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

    // التحقق من أن المستخدم الذي يحذف لديه الصلاحية
    const requesterRoles = await requester.getRoles();
    const isSuperAdmin = requesterRoles.some(role => role.name === "super_admin");

    if (!isSuperAdmin) {
      return res.status(403).json({ message: "You do not have permission to delete this user." });
    }

    await userToDelete.destroy();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  deleteUser,
};