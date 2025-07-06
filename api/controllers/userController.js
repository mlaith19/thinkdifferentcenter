const User = require("../models/User");
const Role = require("../models/role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/errorHandler");
const { sendEmail } = require("../utils/mailer");
const Institute = require("../models/Institute");
const { decryptLicenseKey } = require("../utils/LicenseKeyService");
// توليد التوكن
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email,role: user.role,instituteId: user.instituteId,branchId: user.branchId},
    process.env.JWT_SECRET || "jwt_secret_key",
    { expiresIn: "500h" }
  );
};
const { Op } = require("sequelize");
// إنشاء حساب جديد
const createUser = async (req, res) => {
  const { username, email, password, fullName, role, instituteId, branchId, birthDate, phone } = req.body; // Include birthDate and phone
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
      birthDate, // Include birthDate
      phone, // Include phone
    });

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,  birthDate: newUser.birthDate,
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
    // Find user by email
    const user = await User.findOne({ 
      where: { email },
      include: [
        {
          model: Institute,
          as: 'adminInstitute',
          attributes: ['id', 'name', 'licenseKey']
        }
      ]
    });

    if (!user) {
      return res.status(401).json({
        succeed: false,
        message: "Invalid email or password.",
        data: null,
        errorDetails: null
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        succeed: false,
        message: "Your account is deactivated. Please contact your administrator.",
        data: null,
        errorDetails: null
      });
    }

    // Check if user belongs to an institute
    if (user.instituteId) {
      const institute = user.adminInstitute;
      if (!institute) {
        return res.status(403).json({
          succeed: false,
          message: "Your institute account is not found. Please contact support.",
          data: null,
          errorDetails: null
        });
      }

      // Decrypt and validate license key
      try {
        const decryptedLicenseKey = decryptLicenseKey(institute.licenseKey);
        const [startDateISO, endDateISO] = decryptedLicenseKey.split("||").slice(0, 2);
        const endDate = new Date(endDateISO);
        const currentDate = new Date();

        if (currentDate > endDate) {
          return res.status(403).json({
            succeed: false,
            message: "Your institute's license has expired. Please renew your license.",
            data: null,
            errorDetails: {
              licenseExpired: true,
              expiryDate: endDateISO
            }
          });
        }
      } catch (decryptError) {
        console.error("Error decrypting license key:", decryptError);
        return res.status(403).json({
          succeed: false,
          message: "Invalid institute license. Please contact support.",
          data: null,
          errorDetails: null
        });
      }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        succeed: false,
        message: "Invalid email or password.",
        data: null,
        errorDetails: null
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user);

    // Return success response
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        instituteId: user.instituteId,
        branchId: user.branchId,
        isActive: user.isActive
      },
      role: user.role
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ 
      message: errorMessage,
      errorDetails 
    });
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

    const { instituteId: queryInstituteId } = req.query;
    const instituteId = requester.instituteId || queryInstituteId;

    let users;

    const baseQuery = {
      where: {
        role: { [Op.ne]: "super_admin" }, // <-- Exclude super_admin
      },
      attributes: ["id", "username", "email", "fullName", "role", "isActive", "branchId", "createdAt"],
    };

    if (instituteId) {
      baseQuery.where.instituteId = instituteId;
    }

    users = await User.findAll(baseQuery);

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
  const userId = req.params.userId;
  const requester = req.user;
  const updates = req.body;

  try {
    if (!["super_admin", "institute_admin"].includes(requester.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    if (requester.role === "institute_admin" && 
        (userToUpdate.instituteId !== requester.instituteId || userToUpdate.branchId !== requester.branchId)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await userToUpdate.update(updates);
    
    res.status(200).json({
      message: "User updated successfully",
      user: userToUpdate
    });
  } catch (error) {
    const { statusCode, errorMessage } = handleError(error);
    res.status(statusCode).json({ message: errorMessage });
  }
};

// حذف المستخدم
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const requester = req.user;
 
  try {
    const userToDelete = await User.findByPk(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }
    if (requester.role !== "super_admin" && requester.role !== "institute_admin") {
      return res.status(403).json({ message: "Unauthorized action2" });
    }


    await userToDelete.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    const { statusCode, errorMessage } = handleError(error);
    res.status(statusCode).json({ message: errorMessage });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a password reset token
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Create the reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Send the reset link via email
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Click the following link to reset your password: ${resetLink}`
    );

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};


module.exports = {
  createUser,
  loginUser,
  logoutUser,
  deleteUser,
  getAllUsers,
  getUsersByInstituteId,
  getUsersByBranchId, updateUser,
  forgotPassword,
  resetPassword
};