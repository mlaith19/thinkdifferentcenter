const express = require("express");
const StudentController = require("../controllers/StudentController");
const { authenticate } = require("../middlewares/auth_JWT");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Student dashboard routes
router.get("/:studentId/stats", StudentController.getStudentStats);
router.get("/:studentId/courses", StudentController.getStudentCourses);
router.get("/:studentId/attendance", StudentController.getStudentAttendance);
router.get("/:studentId/points", StudentController.getStudentPoints);
router.get("/:studentId/upcoming-sessions", StudentController.getUpcomingSessions);
router.get("/:studentId/course-materials", StudentController.getCourseMaterials);
router.get("/:studentId/payments", StudentController.getPaymentHistory);

// Institute student management routes
router.get("/institute/:instituteId/students", StudentController.getStudentsByInstituteId);
router.post("/institute/:instituteId/students", StudentController.addStudent);
router.put("/:studentId", StudentController.updateStudent);
router.delete("/:studentId", StudentController.deleteStudent);
router.get('/courses/:courseId/attendance-summary',     StudentController.getAttendanceSummary); 
module.exports = router;