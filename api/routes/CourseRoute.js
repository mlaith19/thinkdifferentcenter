const express = require("express");
const { body, param } = require("express-validator");
const CourseController = require("../controllers/CourseController");
const { authenticate } = require("../middlewares/auth_JWT");
 
const router = express.Router();

// Create a new course
router.post(
  "/create",
  authenticate,
 
  [
    body("name").notEmpty().withMessage("Course name is required."),
    body("paymentType").isIn(["free", "per_session", "full_course"]).withMessage("Invalid payment type."),
    body("registrationStartDate").isDate().withMessage("Invalid registration start date."),
    body("registrationEndDate").isDate().withMessage("Invalid registration end date."),
    body("instituteId").isInt().withMessage("Institute ID must be a valid integer."),
    body("branchId").isInt().withMessage("Branch ID must be a valid integer."),
  ],
  CourseController.createCourse
);

// Get all courses
router.get("/", authenticate, CourseController.getAllCourses);

// Get a course by ID
router.get(
  "/:courseId",
  authenticate,
  [param("courseId").isInt().withMessage("Course ID must be a valid integer.")],
  CourseController.getCourseById
);

// Update a course
router.put(
  "/:courseId",
  authenticate,
 
  [
    param("courseId").isInt().withMessage("Course ID must be a valid integer."),
    body("name").optional().notEmpty().withMessage("Course name is required."),
    body("paymentType").optional().isIn(["free", "per_session", "full_course"]).withMessage("Invalid payment type."),
    body("registrationStartDate").optional().isDate().withMessage("Invalid registration start date."),
    body("registrationEndDate").optional().isDate().withMessage("Invalid registration end date."),
  ],
  CourseController.updateCourse
);

// Delete a course
router.delete(
  "/:courseId",
  authenticate,
 
  [param("courseId").isInt().withMessage("Course ID must be a valid integer.")],
  CourseController.deleteCourse
);

module.exports = router;