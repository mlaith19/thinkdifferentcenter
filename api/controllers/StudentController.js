const Institute = require("../models/Institute");
const User = require("../models/User");
const Branch = require("../models/Branch");
const Course = require("../models/Course");
const ParticipatingStudents = require("../models/ParticipatingStudents");
const Attendance = require("../models/Attendance");
const Session = require("../models/Session");
const CourseMaterial = require("../models/CourseMaterial");
const Payment = require("../models/Payment");
const { handleError } = require("../utils/errorHandler");
const { Op } = require("sequelize");
const Enrollment = require("../models/Enrollment");

// Get student dashboard statistics
const getStudentStats = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        succeed: false,
        message: "Student not found",
      });
    }

    // Get total courses
    const totalCourses = await ParticipatingStudents.count({
      where: { studentId }
    });

    // Get total points (default to 0 if points field doesn't exist)
    const totalPoints = student.points || 0;

    // Get attendance rate
    const attendance = await Attendance.findAll({
      where: {
        studentId: studentId,
      },
    });

    const totalSessions = attendance.length;
    const presentSessions = attendance.filter((a) => a.status === "present").length;
    const attendanceRate = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0;

    // Get upcoming sessions
    const upcomingSessions = await Session.findAll({
      where: {
        startTime: {
          [Op.gt]: new Date(),
        },
      },
      include: [
        {
          model: Course,
          as: "course",
          include: [
            {
              model: ParticipatingStudents,
              as: "enrollments",
              where: {
                studentId: studentId,
              },
              required: true,
            },
          ],
        },
      ],
      limit: 5,
      order: [["startTime", "ASC"]],
    });

    res.json({
      succeed: true,
      data: {
        totalCourses,
        totalPoints,
        attendanceRate: Math.round(attendanceRate),
        upcomingSessions: upcomingSessions.map((session) => ({
          id: session.id,
          courseName: session.course.name,
          startTime: session.startTime,
          endTime: session.endTime,
        })),
      },
    });
  } catch (error) {
    console.error("Error in getStudentStats:", error);
    res.status(500).json({
      succeed: false,
      message: "Database error",
      errorDetails: {
        message: error.message,
      },
    });
  }
};

// Get student's enrolled courses
const getStudentCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
    const courses = await ParticipatingStudents.findAll({
      where: { studentId },
      include: [{
        model: Course,
        include: [
          {
            model: Session,
            as: "sessions",
            limit: 1,
            order: [['startTime', 'DESC']],
            where: {
              startTime: {
                [Op.gt]: new Date()
              }
            },
            required: false
          }
        ]
      }]
    });

    const formattedCourses = courses.map(course => ({
      id: course.Course.id,
      name: course.Course.name,
      description: course.Course.description,
      status: course.status,
      progress: course.progress || 0,
      nextSession: course.Course.sessions?.[0]?.startTime || null,
      attendanceRate: course.attendanceRate || 0
    }));

    res.status(200).json({
      succeed: true,
      message: "Student courses fetched successfully.",
      data: formattedCourses,
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
};

// Get student's attendance summary
const getStudentAttendance = async (req, res) => {
  const { studentId } = req.params;

  try {
    const attendance = await Attendance.findAll({
      where: { studentId },
      include: [{
        model: Session,
        include: [{
          model: Course
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      succeed: true,
      message: "Student attendance fetched successfully.",
      data: attendance,
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
};

// Get student's points and rewards
const getStudentPoints = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await User.findByPk(studentId, {
      attributes: ['points', 'rewards']
    });

    res.status(200).json({
      succeed: true,
      message: "Student points fetched successfully.",
      data: {
        points: student.points || 0,
        rewards: student.rewards || []
      },
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
};

// Get student's upcoming sessions
const getUpcomingSessions = async (req, res) => {
  const { studentId } = req.params;

  try {
    const sessions = await Session.findAll({
      where: {
        startTime: {
          [Op.gt]: new Date()
        }
      },
      include: [{
        model: Course,
        include: [{
          model: ParticipatingStudents,
          where: { studentId }
        }]
      }],
      order: [['startTime', 'ASC']]
    });

    res.status(200).json({
      succeed: true,
      message: "Upcoming sessions fetched successfully.",
      data: sessions,
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
};

// Get student's course materials
const getCourseMaterials = async (req, res) => {
  const { studentId } = req.params;

  try {
    const materials = await CourseMaterial.findAll({
      include: [{
        model: Course,
        include: [{
          model: ParticipatingStudents,
          where: { studentId }
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      succeed: true,
      message: "Course materials fetched successfully.",
      data: materials,
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
};

// Get student's payment history
const getPaymentHistory = async (req, res) => {
  const { studentId } = req.params;

  try {
    const payments = await Payment.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      succeed: true,
      message: "Payment history fetched successfully.",
      data: payments,
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
};

// Get all students by instituteId
const getStudentsByInstituteId = async (req, res) => {
  const { instituteId } = req.params;

  try {
    const students = await User.findAll({
      where: { instituteId, role: "student" },
      attributes: ["id", "fullName", "email", "isActive"],
      include: [
        {
          model: Institute,
          attributes: ["name"],
        },
        {
          model: Branch,
          as: "branch",
          attributes: ["name"],
        },
      ],
    });

    if (!students || students.length === 0) {
      return res.status(201).json({
        succeed: true,
        message: "No students found for this institute.",
        data: [],
        errorDetails: null,
      });
    }

    res.status(200).json({
      succeed: true,
      message: "Students fetched successfully.",
      data: students,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};

// Add a new student
const addStudent = async (req, res) => {
  const { instituteId } = req.params;
  const { fullName, email, phone, birthDate, branchId } = req.body;

  try {
    const newStudent = await User.create({
      fullName,
      email,
      phone,
      birthDate,
      role: "student",
      instituteId,
      branchId,
      isActive: true,
    });

    res.status(201).json({
      succeed: true,
      message: "Student added successfully.",
      data: newStudent,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};

// Update a student
const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const { fullName, email, phone, birthDate, isActive } = req.body;

  try {
    const student = await User.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        succeed: false,
        message: "Student not found.",
        data: null,
        errorDetails: null,
      });
    }

    await student.update({
      fullName,
      email,
      phone,
      birthDate,
      isActive,
    });

    res.status(200).json({
      succeed: true,
      message: "Student updated successfully.",
      data: student,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await User.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        succeed: false,
        message: "Student not found.",
        data: null,
        errorDetails: null,
      });
    }

    await student.destroy();

    res.status(200).json({
      succeed: true,
      message: "Student deleted successfully.",
      data: null,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};

module.exports = {
  getStudentStats,
  getStudentCourses,
  getStudentAttendance,
  getStudentPoints,
  getUpcomingSessions,
  getCourseMaterials,
  getPaymentHistory,
  getStudentsByInstituteId,
  addStudent,
  updateStudent,
  deleteStudent
};