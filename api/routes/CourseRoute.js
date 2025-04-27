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
    body("paymentType")
      .isIn(["free", "per_session", "full_course"])
      .withMessage("Invalid payment type."),
    body("registrationStartDate")
      .isDate()
      .withMessage("Invalid registration start date."),
    body("registrationEndDate")
      .isDate()
      .withMessage("Invalid registration end date."),
    body("instituteId")
      .isInt()
      .withMessage("Institute ID must be a valid integer."),
    body("teacherId")
      .isInt()
      .withMessage("Teacher ID must be a valid integer."),
    body("teacherName").notEmpty().withMessage("Teacher name is required."),
    body("branchId").isInt().withMessage("Branch ID must be a valid integer."),
    body("numberOfSessions")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Number of sessions must be a valid integer."),
    body("scheduleDays")
      .optional()
      .isArray()
      .withMessage("Schedule days must be an array.")
      .custom((value) => {
        // Validate that scheduleDays contains valid day strings
        const validDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        return value.every((day) => validDays.includes(day));
      })
      .withMessage(
        "Invalid day in scheduleDays. Must be one of: mon, tue, wed, thu, fri, sat, sun."
      ),
    body("autoGenerateSchedule")
      .optional()
      .isBoolean()
      .withMessage("Auto-generate schedule must be a boolean."),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Invalid status."),
    body("sessionDates")
      .optional()
      .isArray()
      .withMessage("Session dates must be an array.")
      .custom((value) => {
        // Validate that sessionDates contains objects with date and title fields
        return value.every((session) => {
          return (
            typeof session === "object" &&
            session.date &&
            session.title &&
            !isNaN(new Date(session.date).getTime()) // Ensure date is valid
          );
        });
      })
      .withMessage(
        "Each session must be an object with 'date' and 'title' fields."
      ),
  ],
  CourseController.createCourse
);

// Get courses by institute ID
router.get(
  "/institute/:instituteId",
  authenticate,
  [
    param("instituteId")
      .isInt()
      .withMessage("Institute ID must be a valid integer."),
  ],
  CourseController.getCoursesByInstituteId
);

// Get all courses
router.get("/", CourseController.getAllCourses);
// Get a course by ID
router.get(
  "/:courseId",

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
    body("paymentType")
      .optional()
      .isIn(["free", "per_session", "full_course"])
      .withMessage("Invalid payment type."),
    body("registrationStartDate")
      .optional()
      .isDate()
      .withMessage("Invalid registration start date."),
    body("registrationEndDate")
      .optional()
      .isDate()
      .withMessage("Invalid registration end date."),
    body("minAge")
      .optional()
      .isInt()
      .withMessage("Minimum age must be a valid integer."),
    body("maxAge")
      .optional()
      .isInt()
      .withMessage("Maximum age must be a valid integer."),
    body("numberOfSessions")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Number of sessions must be a valid integer."),
    body("scheduleDays")
      .optional()
      .isArray()
      .withMessage("Schedule days must be an array.")
      .custom((value) => {
        const validDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        return value.every((day) => validDays.includes(day));
      })
      .withMessage(
        "Invalid day in scheduleDays. Must be one of: mon, tue, wed, thu, fri, sat, sun."
      ),
    body("autoGenerateSchedule")
      .optional()
      .isBoolean()
      .withMessage("Auto-generate schedule must be a boolean."),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Invalid status."),
    body("sessionDates")
      .optional()
      .isArray()
      .withMessage("Session dates must be an array.")
      .custom((value) => {
        return value.every((session) => {
          return (
            typeof session === "object" &&
            session.date &&
            session.title &&
            !isNaN(new Date(session.date).getTime())
          );
        });
      })
      .withMessage(
        "Each session must be an object with 'date' and 'title' fields."
      ),
  ],
  CourseController.updateCourse
);

 
router.delete(
  "/:courseId",
  authenticate,

  [param("courseId").isInt().withMessage("Course ID must be a valid integer.")],
  CourseController.deleteCourse
);

// Join a course
router.post("/join", CourseController.joinCourse);

// Get all participating students for a course
router.get("/:courseId/students", CourseController.getStudentsByCourse);

// // Get all courses for a student
// router.get("/student/:studentId/courses", CourseController.getCoursesByStudent);

// Update enrollment status
router.put(
  "/enrollment/:enrollmentId",
  CourseController.updateEnrollmentStatus
);

router.get(
  "/institute/:instituteId/enrollments",
  CourseController.getEnrollmentsByInstitute
);

module.exports = router;
