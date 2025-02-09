const express = require("express");
const StudentController = require("../controllers/StudentController");
const { authenticate } = require("../middlewares/auth_JWT");

const router = express.Router();

// Get all students by instituteId
router.get("/institute/:instituteId/students", authenticate, StudentController.getStudentsByInstituteId);

// Add a new student
router.post("/institute/:instituteId/students", authenticate, StudentController.addStudent);

// Update a student
router.put("/students/:studentId", authenticate, StudentController.updateStudent);

// Delete a student
router.delete("/students/:studentId", authenticate, StudentController.deleteStudent);

module.exports = router;