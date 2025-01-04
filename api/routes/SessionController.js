const express = require("express");
const { body, param } = require("express-validator");
const SessionController = require("../controllers/SessionController");
const { authenticate } = require("../middlewares/auth_JWT");

const router = express.Router();

 
router.post(
  "/create",
  authenticate,
  [
    body("date").isDate().withMessage("Invalid date."),
    body("startTime").notEmpty().withMessage("Start time is required."),
    body("endTime").notEmpty().withMessage("End time is required."),
    body("courseId").isInt().withMessage("Course ID must be a valid integer."),
    body("teacherId").isInt().withMessage("Teacher ID must be a valid integer."),
  ],
  SessionController.createSession
);

 
router.get(
  "/teacher/:teacherId",
  authenticate,
  [param("teacherId").isInt().withMessage("Teacher ID must be a valid integer.")],
  SessionController.getSessionsByTeacher
);

module.exports = router;