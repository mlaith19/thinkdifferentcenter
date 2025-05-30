const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/SessionController');
const { authenticate } = require('../middlewares/auth_JWT');
const { param } = require('express-validator');

// Create a new session
router.post('/create', authenticate, sessionController.createSession);

// Get a single session by ID
router.get('/:sessionId', 
  authenticate,
  [
    param('sessionId').isInt().withMessage('Session ID must be a valid integer')
  ],
  sessionController.getSessionById
);

// Delete a session
router.delete('/:sessionId', authenticate, sessionController.deleteSession);

// Get sessions for a course
router.get('/course/:courseId', authenticate, sessionController.getCourseSessions);

// Get sessions for a teacher
router.get('/teacher/:teacherId', authenticate, sessionController.getSessionsByTeacher);

module.exports = router; 