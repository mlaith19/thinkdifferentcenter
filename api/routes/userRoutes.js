const express = require("express");
const { body, param } = require("express-validator");
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth_JWT");
const { authorizeSuperAdmin } = require("../middlewares/authorizeSuperAdmin");

const router = express.Router();

// إنشاء مستخدم جديد
router.post(
  "/create",
  authenticate,
  authorizeSuperAdmin,
  [
    body("username").notEmpty().withMessage("Username is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    body("roleId").isInt().withMessage("Role ID must be a valid integer."),
  ],
  userController.createUser
);

// تسجيل الدخول
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  userController.loginUser
);

// تسجيل الخروج
router.post("/logout", authenticate, userController.logoutUser);

// حذف مستخدم
router.delete(
  "/delete/:userId",
  authenticate,
  authorizeSuperAdmin,
  [
    param("userId").isInt().withMessage("User ID must be a valid integer."),
  ],
  userController.deleteUser
);
router.get(
  "/all",
  authenticate,          // Authenticate the user
  authorizeSuperAdmin,   // Ensure only super admin can view all users
  userController.getAllUsers // Controller to handle fetching all users
);

router.get(
  "/institute",
  authenticate,
  [
    param("instituteId").isInt().withMessage("Institute ID must be a valid integer."),
  ],
  userController.getUsersByInstituteId
);

// Get users by branchId
router.get(
  "/branch",
  authenticate,
  [
    param("branchId").isInt().withMessage("Branch ID must be a valid integer."),
  ],
  userController.getUsersByBranchId
);
module.exports = router;