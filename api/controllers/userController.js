const User = require("../models/User");
const Role = require("../models/role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/errorHandler");

// توليد التوكن
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email,role: user.role,instituteId: user.instituteId,branchId: user.branchId},
    process.env.JWT_SECRET || "jwt_secret_key",
    { expiresIn: "500h" }
  );
};

// إنشاء حساب جديد
const createUser = async (req, res) => {
  const { username, email, password, fullName, role, instituteId, branchId } = req.body; // Include branchId
  const creator = req.user;

  try {
    // Check if the creator has permission
    if (!["super_admin", "institute_admin"].includes(creator.role)) {
      return res.status(403).json({ message: "You do not have permission to create users." });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      role,
      instituteId: creator.role === "institute_admin" ? creator.instituteId : instituteId,
      branchId: creator.role === "institute_admin" ? creator.branchId : branchId, // Assign branchId
    });

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
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
    // Find the user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful.",
      token,
      role: user.role, // Fetch role directly from the user record
    });
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
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users along with their associated roles and institutes
    const users = await User.findAll({
      attributes: ["id", "username", "email", "fullName", "role", "instituteId","isActive","branchId","createdAt",],
     
    });

    res.status(200).json({
      succeed: true,
      message: "Users fetched successfully.",
      data: users,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};
const getUsersByInstituteId = async (req, res) => {
  const requester = req.user;

  try {
    // Restrict access to super_admin and institute_admin
    if (!["super_admin", "institute_admin"].includes(requester.role)) {
      return res.status(403).json({ message: "You are not authorized to perform this action." });
    }

    const { instituteId: queryInstituteId } = req.query; // Get instituteId from query params
    const instituteId = requester.instituteId || queryInstituteId; // Use token's instituteId or query param

    let users;

    if (instituteId) {
      // Fetch users by instituteId
      users = await User.findAll({
        where: { instituteId },
        attributes: ["id", "username", "email", "fullName", "role", "isActive", "branchId", "createdAt"],
      });
    } else {
      // Fetch all users if instituteId is null
      users = await User.findAll({
        attributes: ["id", "username", "email", "fullName", "role", "isActive", "branchId", "createdAt", "instituteId"],
      });
    }

    res.status(200).json({
      succeed: true,
      message: instituteId
        ? `Users fetched successfully for institute ID ${instituteId}.`
        : "All users fetched successfully.",
      data: users,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

const getUsersByBranchId = async (req, res) => {
  const requester = req.user;

  try {
    // Restrict access to super_admin and institute_admin
    if (!["super_admin", "institute_admin"].includes(requester.role)) {
      return res.status(403).json({ message: "You are not authorized to perform this action." });
    }

    const { branchId: queryBranchId } = req.query; // Get branchId from query params
    const branchId = requester.branchId || queryBranchId; // Use token's branchId or query param

    let users;

    if (branchId) {
      // Fetch users by branchId
      users = await User.findAll({
        where: { branchId },
        attributes: ["id", "username", "email", "fullName", "role", "isActive", "instituteId", "createdAt"],
      });
    } else {
      // Fetch all users if branchId is null
      users = await User.findAll({
        attributes: ["id", "username", "email", "fullName", "role", "isActive", "branchId", "createdAt", "instituteId"],
      });
    }

    res.status(200).json({
      succeed: true,
      message: branchId
        ? `Users fetched successfully for branch ID ${branchId}.`
        : "All users fetched successfully.",
      data: users,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};
const updateUser = async (req, res) => {
  const userId  = req.body.userId; // User ID from route parameters
  const requester = req.user; // Authenticated requester details
  const updates = req.body; // Fields to update

  try {
    // Check if the requester has permission to update users
    if (!["super_admin", "institute_admin"].includes(requester.role)) {
      return res.status(403).json({ message: "You do not have permission to update users." });
    }
console.log(userId);
    // Fetch the user to update
    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found." });
    }

    // Ensure institute_admins can only update users in their institute/branch
    if (
      requester.role === "institute_admin" &&
      (userToUpdate.instituteId !== requester.instituteId || userToUpdate.branchId !== requester.branchId)
    ) {
      return res.status(403).json({
        message: "You do not have permission to update users outside your institute or branch.",
      });
    }

    // Hash password if it's being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Update the user with the provided fields
    await userToUpdate.update(updates);

    // Respond with the updated user details (omit sensitive fields like password)
    res.status(200).json({
      message: "User updated successfully.",
      user: {
        id: userToUpdate.id,
        username: userToUpdate.username,
        email: userToUpdate.email,
        fullName: userToUpdate.fullName,
        role: userToUpdate.role,
        instituteId: userToUpdate.instituteId,
        branchId: userToUpdate.branchId,
        isActive: userToUpdate.isActive,
        createdAt: userToUpdate.createdAt,
      },
    });
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

    if (requester.role !== "super_admin") {
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
  getAllUsers,
  getUsersByInstituteId,
  getUsersByBranchId, updateUser
};