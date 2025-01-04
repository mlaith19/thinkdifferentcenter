const express = require("express");
const StudentController = require("../controllers/StudentController");
const { authenticate } = require("../middlewares/auth_JWT");

const router = express.Router();

// عرض جدول الحصص
router.get("/schedule", authenticate, StudentController.getStudentSchedule);

// عرض الحضور والنقاط
router.get("/attendance-points", authenticate, StudentController.getStudentAttendanceAndPoints);

module.exports = router;