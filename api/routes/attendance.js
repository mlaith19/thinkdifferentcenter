const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { authenticate } = require("../middlewares/auth_JWT");
const { body, param } = require("express-validator");

// Get attendance for a specific session
router.get(
  "/session/:sessionId",
  authenticate,
  [
    param("sessionId").isInt().withMessage("Session ID must be a valid integer."),
  ],
  attendanceController.getSessionAttendance
);

// Mark attendance for multiple students
router.post(
  "/mark",
  authenticate,
  [
    body("sessionId").isInt().withMessage("Session ID must be a valid integer."),
    body("attendanceData").isArray().withMessage("Attendance data must be an array."),
    body("attendanceData.*.studentId").isInt().withMessage("Student ID must be a valid integer."),
    body("attendanceData.*.status").isIn(["present", "absent", "late", "excused"]).withMessage("Invalid attendance status."),
  ],
  attendanceController.markAttendance
);

// Get attendance statistics for a course
router.get(
  "/course/:courseId/stats",
  authenticate,
  [
    param("courseId").isInt().withMessage("Course ID must be a valid integer."),
  ],
  attendanceController.getCourseAttendanceStats
);

module.exports = router; 