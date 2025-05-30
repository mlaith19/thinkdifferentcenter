const { Session, Course } = require('../models/associations');
const { Op } = require('sequelize');
const { handleError } = require("../utils/errorHandler");

const sessionController = {
  // Get a single session by ID
  getSessionById: async (req, res) => {
    try {
      const { sessionId } = req.params;

      const session = await Session.findOne({
        where: { id: sessionId },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'name', 'description', 'numberOfSessions']
          }
        ]
      });

      if (!session) {
        return res.status(404).json({
          succeed: false,
          message: 'Session not found',
          data: null,
          errorDetails: {
            code: 404,
            details: 'The specified session does not exist'
          }
        });
      }

      res.json({
        succeed: true,
        message: 'Session retrieved successfully',
        data: session,
        errorDetails: null
      });
    } catch (error) {
      const { statusCode, errorMessage, errorDetails } = handleError(error);
      res.status(statusCode).json({
        succeed: false,
        message: errorMessage,
        data: null,
        errorDetails
      });
    }
  },

  // Create a new session
  createSession: async (req, res) => {
    try {
      const { date, startTime, endTime, status, courseId, teacherId } = req.body;

      // Get course details
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({
          succeed: false,
          message: 'Course not found',
          data: null,
          errorDetails: {
            code: 404,
            details: 'The specified course does not exist'
          }
        });
      }

      // Validate session date is within course registration period
      const sessionDate = new Date(date);
      const registrationStart = new Date(course.registrationStartDate);
      const registrationEnd = new Date(course.registrationEndDate);

      if (sessionDate < registrationStart || sessionDate > registrationEnd) {
        return res.status(400).json({
          succeed: false,
          message: 'Session date must be within course registration period',
          data: null,
          errorDetails: {
            code: 400,
            details: `Session date must be between ${registrationStart.toLocaleDateString()} and ${registrationEnd.toLocaleDateString()}`
          }
        });
      }

      // Check total number of sessions
      const existingSessionsCount = await Session.count({
        where: { courseId }
      });

      if (existingSessionsCount >= course.numberOfSessions) {
        return res.status(400).json({
          succeed: false,
          message: 'Maximum number of sessions reached',
          data: null,
          errorDetails: {
            code: 400,
            details: `Course allows maximum ${course.numberOfSessions} sessions`
          }
        });
      }

      // Validate time format and logic
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);

      if (end <= start) {
        return res.status(400).json({
          succeed: false,
          message: 'End time must be after start time',
          data: null,
          errorDetails: {
            code: 400,
            details: 'Session end time must be after start time'
          }
        });
      }

      // Check for overlapping sessions
      const overlappingSession = await Session.findOne({
        where: {
          courseId,
          date,
          [Op.or]: [
            {
              startTime: {
                [Op.between]: [startTime, endTime]
              }
            },
            {
              endTime: {
                [Op.between]: [startTime, endTime]
              }
            }
          ]
        }
      });

      if (overlappingSession) {
        return res.status(400).json({
          succeed: false,
          message: 'Session time overlaps with existing session',
          data: null,
          errorDetails: {
            code: 400,
            details: 'There is already a session scheduled during this time'
          }
        });
      }

      // Create the session
      const session = await Session.create({
        date,
        startTime,
        endTime,
        status,
        courseId,
        teacherId: teacherId || course.teacherId
      });

      res.status(201).json({
        succeed: true,
        message: 'Session created successfully',
        data: session,
        errorDetails: null
      });
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({
        succeed: false,
        message: 'Failed to create session',
        data: null,
        errorDetails: {
          code: 500,
          details: error.message
        }
      });
    }
  },

  // Delete a session
  deleteSession: async (req, res) => {
    try {
      const { sessionId } = req.params;

      const session = await Session.findByPk(sessionId);
      if (!session) {
        return res.status(404).json({
          succeed: false,
          message: 'Session not found',
          data: null,
          errorDetails: {
            code: 404,
            details: 'The specified session does not exist'
          }
        });
      }

      // Check if session is in the past
      const sessionDate = new Date(session.date);
      const today = new Date();
      if (sessionDate < today) {
        return res.status(400).json({
          succeed: false,
          message: 'Cannot delete past sessions',
          data: null,
          errorDetails: {
            code: 400,
            details: 'Only future sessions can be deleted'
          }
        });
      }

      await session.destroy();

      res.json({
        succeed: true,
        message: 'Session deleted successfully',
        data: null,
        errorDetails: null
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      res.status(500).json({
        succeed: false,
        message: 'Failed to delete session',
        data: null,
        errorDetails: {
          code: 500,
          details: error.message
        }
      });
    }
  },

  // Get sessions for a course
  getCourseSessions: async (req, res) => {
    try {
      const { courseId } = req.params;

      const sessions = await Session.findAll({
        where: { courseId },
        order: [['date', 'ASC'], ['startTime', 'ASC']]
      });

      res.json({
        succeed: true,
        message: 'Sessions retrieved successfully',
        data: sessions,
        errorDetails: null
      });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({
        succeed: false,
        message: 'Failed to fetch sessions',
        data: null,
        errorDetails: {
          code: 500,
          details: error.message
        }
      });
    }
  },

  // عرض الحصص الخاصة بمدرس معين
  getSessionsByTeacher: async (req, res) => {
    const { teacherId } = req.params;

    try {
      const sessions = await Session.findAll({
        where: { teacherId },
        include: [{ model: Course, attributes: ["name", "description"] }],
      });

      res.status(200).json(sessions);
    } catch (error) {
      const { statusCode, errorMessage, errorDetails } = handleError(error);
      res.status(statusCode).json({ message: errorMessage, errorDetails });
    }
  }
};

module.exports = sessionController;