const { Attendance, User, Session, Course, ParticipatingStudents } = require("../models/associations");
const { Op } = require("sequelize");
const { handleError } = require("../utils/errorHandler");

// Get attendance for a specific session
exports.getSessionAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Get session with course details
    const session = await Session.findOne({
      where: { id: sessionId },
      include: [
        {
          model: Course,
          as: "course"
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        succeed: false,
        message: "Session not found",
        data: null,
        errorDetails: {
          code: 404,
          details: "The specified session does not exist"
        }
      });
    }

    // Validate session date
    const sessionDate = new Date(session.date);
    const today = new Date();
    if (sessionDate > today) {
      return res.status(400).json({
        succeed: false,
        message: "Cannot mark attendance for future sessions",
        data: null,
        errorDetails: {
          code: 400,
          details: "Attendance can only be marked for past or current sessions"
        }
      });
    }

    // Validate session status
    if (session.status === "cancelled") {
      return res.status(400).json({
        succeed: false,
        message: "Cannot mark attendance for cancelled sessions",
        data: null,
        errorDetails: {
          code: 400,
          details: "This session has been cancelled"
        }
      });
    }

    // Get existing attendance records
    const existingAttendance = await Attendance.findAll({
      where: { sessionId },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "fullName", "email"]
        }
      ]
    });

    // Create a map of existing attendance records
    const attendanceMap = new Map(
      existingAttendance.map(record => [record.studentId, record])
    );

    // Get enrolled students for the course
    const enrolledStudents = await ParticipatingStudents.findAll({
      where: { courseId: session.courseId },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "fullName", "email"]
        }
      ]
    });

    // Prepare attendance data for all enrolled students
    const attendanceData = enrolledStudents.map(enrollment => {
      const student = enrollment.student;
      const existingRecord = attendanceMap.get(student.id);
      return {
        studentId: student.id,
        studentName: student.fullName,
        status: existingRecord?.status || "absent",
        notes: existingRecord?.notes || "",
        markedAt: existingRecord?.createdAt || null,
        markedBy: existingRecord?.markedBy || null
      };
    });

    res.json({
      succeed: true,
      message: "Attendance data retrieved successfully",
      data: attendanceData,
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

// Mark attendance for multiple students
exports.markAttendance = async (req, res) => {
  try {
    const { sessionId, attendanceData, teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        succeed: false,
        message: "Teacher ID is required",
        data: null,
        errorDetails: {
          code: 400,
          details: "Teacher ID must be provided to mark attendance"
        }
      });
    }

    // Validate session exists and belongs to teacher
    const session = await Session.findOne({
      where: { 
        id: sessionId,
        teacherId: teacherId
      },
      include: [
        { 
          model: Course, 
          as: "course",
          include: [
            {
              model: ParticipatingStudents,
              as: "enrollments",
              include: [
                {
                  model: User,
                  as: "student",
                  attributes: ["id"]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        succeed: false,
        message: "Session not found",
        data: null,
        errorDetails: {
          code: 404,
          details: "The specified session does not exist or you don't have permission to access it"
        }
      });
    }

    // Validate session date
    const sessionDate = new Date(session.date);
    const today = new Date();
    if (sessionDate > today) {
      return res.status(400).json({
        succeed: false,
        message: "Cannot mark attendance for future sessions",
        data: null,
        errorDetails: {
          code: 400,
          details: "Attendance can only be marked for past or current sessions"
        }
      });
    }

    // Validate session status
    if (session.status === "cancelled") {
      return res.status(400).json({
        succeed: false,
        message: "Cannot mark attendance for cancelled sessions",
        data: null,
        errorDetails: {
          code: 400,
          details: "This session has been cancelled"
        }
      });
    }

    // Get enrolled student IDs
    const enrolledStudentIds = new Set(
      session.course.enrollments.map(enrollment => enrollment.student.id)
    );

    // Validate all students are enrolled in the course
    const invalidStudents = attendanceData.filter(
      record => !enrolledStudentIds.has(record.studentId)
    );

    if (invalidStudents.length > 0) {
      return res.status(400).json({
        succeed: false,
        message: "Invalid students in attendance data",
        data: null,
        errorDetails: {
          code: 400,
          details: "Some students are not enrolled in this course"
        }
      });
    }

    // Create or update attendance records
    const attendanceRecords = await Promise.all(
      attendanceData.map(async (record) => {
        const [attendance, created] = await Attendance.findOrCreate({
          where: {
            sessionId,
            studentId: record.studentId
          },
          defaults: {
            status: record.status,
            notes: record.notes,
            markedBy: teacherId,
            markedAt: new Date()
          }
        });

        if (!created) {
          await attendance.update({
            status: record.status,
            notes: record.notes,
            markedBy: teacherId,
            markedAt: new Date()
          });
        }

        return attendance;
      })
    );

    res.json({
      succeed: true,
      message: "Attendance marked successfully",
      data: attendanceRecords,
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

// Get attendance statistics for a course
exports.getCourseAttendanceStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

    // Verify teacher has access to this course
    const course = await Course.findOne({
      where: { id: courseId, teacherId },
      include: [
        {
          model: Session,
          as: "sessions",
          include: [
            {
              model: Attendance,
              as: "attendances",
              include: [
                {
                  model: User,
                  as: "student",
                  attributes: ["id", "firstName", "lastName"]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        succeed: false,
        message: "Course not found",
        data: null,
        errorDetails: {
          code: 404,
          details: "The specified course does not exist or you don't have permission to access it"
        }
      });
    }

    // Calculate statistics
    const stats = {
      totalSessions: course.sessions.length,
      attendanceByStudent: {},
      overallAttendance: {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0
      }
    };

    course.sessions.forEach(session => {
      session.attendances.forEach(attendance => {
        const studentId = attendance.student.id;
        if (!stats.attendanceByStudent[studentId]) {
          stats.attendanceByStudent[studentId] = {
            student: attendance.student,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0
          };
        }
        stats.attendanceByStudent[studentId][attendance.status]++;
        stats.overallAttendance[attendance.status]++;
      });
    });

    res.json({
      succeed: true,
      message: "Attendance statistics retrieved successfully",
      data: stats,
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