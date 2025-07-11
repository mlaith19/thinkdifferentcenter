const Course = require("../models/Course");
const User = require("../models/User");
const ParticipatingStudents = require("../models/ParticipatingStudents");
const Branch = require("../models/Branch");
const { handleError } = require("../utils/errorHandler");
const Sequelize = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");
const Session = require("../models/Session");
const { addDays, addWeeks, format, parseISO, isWithinInterval } = require('date-fns');

// إنشاء دورة جديدة
const createCourse = async (req, res) => {
  const {
    name,
    description,
    paymentType,
    price,
    registrationStartDate,
    registrationEndDate,
    minAge,
    maxAge,
    numberOfSessions,
    scheduleDays,
    autoGenerateSchedule,
    status,
    sessionDates,
    instituteId,
    branchId,
    teacherId,
    teacherName,
  } = req.body;

  try {
    // Validate sessionDates (if provided)
    if (sessionDates && Array.isArray(sessionDates)) {
      const startDate = new Date(registrationStartDate);
      const endDate = new Date(registrationEndDate);
      for (const session of sessionDates) {
        const sessionDate = new Date(session.date);
        if (sessionDate < startDate || sessionDate > endDate) {
          return res.status(400).json({
            succeed: false,
            message: "Session dates must be between registration start and end dates.",
            data: null,
            errorDetails: null,
          });
        }
      }
    }

    // Create the new course
    const newCourse = await Course.create({
      name,
      description,
      paymentType,
      price,
      registrationStartDate,
      registrationEndDate,
      minAge,
      maxAge,
      numberOfSessions,
      scheduleDays: JSON.stringify(scheduleDays), // Convert to JSON string
      autoGenerateSchedule,
      status,
      sessionDates: sessionDates ? JSON.stringify(sessionDates) : null, // Convert to JSON string
      instituteId,
      branchId,
      teacherId,
      teacherName,
    });

    res.status(201).json({
      succeed: true,
      message: "Course created successfully.",
      data: newCourse,
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

// Get courses by institute ID
const getCoursesByInstituteId = async (req, res) => {
  const { instituteId } = req.params;

  try {
    const courses = await Course.findAll({
      where: { instituteId },
      include: [
        {
          model: ParticipatingStudents,
          as: "enrollments",
          attributes: [], // We only need the count, no need to fetch individual enrollments
        },
        {
          model: Session,
          as: "sessions",
          attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
          order: [['date', 'ASC'], ['startTime', 'ASC']]
        }
      ],
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("enrollments.id")), "studentCount"],
        ],
      },
      group: ["Course.id", "sessions.id"], // Group by course and sessions to ensure count works correctly
    });

    if (!courses.length) {
      return res.status(404).json({
        succeed: false,
        message: "No courses found for this institute.",
        data: null,
      });
    }

    // Format the response to handle the grouped data
    const formattedCourses = courses.reduce((acc, course) => {
      const existingCourse = acc.find(c => c.id === course.id);
      if (existingCourse) {
        if (course.sessions) {
          existingCourse.sessions.push(course.sessions);
        }
      } else {
        acc.push({
          ...course.toJSON(),
          sessions: course.sessions ? [course.sessions] : []
        });
      }
      return acc;
    }, []);

    res.status(200).json({
      succeed: true,
      message: "Courses fetched successfully.",
      data: formattedCourses,
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({
      succeed: false,
      message: "Database error",
      errorDetails: error.message,
    });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const { instituteId } = req.query;
    
    // Build the where clause based on instituteId
    const whereClause = instituteId ? { instituteId } : {};

    const courses = await Course.findAll({
      where: whereClause,
      include: [
        {
          model: ParticipatingStudents,
          as: "enrollments",
          attributes: [], // Exclude individual enrollments, only count them
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("enrollments.id")), "studentCount"],
        ],
      },
      group: ["Course.id"], // Group by course to ensure count works correctly
    });

    res.status(200).json({
      succeed: true,
      message: instituteId 
        ? `Courses fetched successfully for institute ID ${instituteId}.`
        : "All courses fetched successfully.",
      data: courses,
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

// Get course by ID
const getCourseById = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: ParticipatingStudents,
          as: "enrollments",
          include: [
            {
              model: User,
              as: "student",
              attributes: ['id', 'fullName', 'email', 'phone', 'birthDate', 'role']
            }
          ]
        },
        {
          model: User,
          as: "teacher",
          attributes: ['id', 'fullName', 'email', 'phone', 'role', 'teachingHourType']
        },
        {
          model: Branch,
          as: "branch",
          attributes: ['id', 'name', 'address', 'phone']
        },
        {
          model: Session,
          as: "sessions",
          attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
          order: [['date', 'ASC'], ['startTime', 'ASC']]
        }
      ],
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("enrollments.id")), "studentCount"]
        ]
      },
      group: [
        "Course.id",
        "enrollments.id",
        "enrollments->student.id",
        "teacher.id",
        "branch.id",
        "sessions.id"
      ]
    });

    if (!course) {
      return res.status(404).json({
        succeed: false,
        message: "Course not found.",
        data: null,
        errorDetails: null,
      });
    }

    // Format the response data
    const formattedCourse = {
      id: course.id,
      name: course.name,
      description: course.description,
      paymentType: course.paymentType,
      price: course.price,
      registrationStartDate: course.registrationStartDate,
      registrationEndDate: course.registrationEndDate,
      minAge: course.minAge,
      maxAge: course.maxAge,
      numberOfSessions: course.numberOfSessions,
      scheduleDays: course.scheduleDays,
      autoGenerateSchedule: course.autoGenerateSchedule,
      status: course.status,
      sessionDates: course.sessionDates,
      studentCount: course.getDataValue('studentCount'),
      teacher: course.teacher,
      branch: course.branch,
      sessions: course.sessions || [],
      enrolledStudents: course.enrollments.map(enrollment => ({
        enrollmentId: enrollment.id,
        enrollmentDate: enrollment.enrollmentDate,
        status: enrollment.status,
        student: enrollment.student
      }))
    };

    res.status(200).json({
      succeed: true,
      message: "Course fetched successfully.",
      data: formattedCourse,
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

// Update a course
const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const updates = req.body;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
        data: null,
        errorDetails: null,
      });
    }

    // Validate sessionDates (if provided)
    if (updates.sessionDates && Array.isArray(updates.sessionDates)) {
      const startDate = new Date(course.registrationStartDate);
      const endDate = new Date(course.registrationEndDate);
      for (const session of updates.sessionDates) {
        const sessionDate = new Date(session.date);
        if (sessionDate < startDate || sessionDate > endDate) {
          return res.status(400).json({
            succeed: false,
            message: "Session dates must be between registration start and end dates.",
            data: null,
            errorDetails: null,
          });
        }
      }
    }

    // Convert scheduleDays and sessionDates to JSON strings if they are provided
    if (updates.scheduleDays) {
      updates.scheduleDays = JSON.stringify(updates.scheduleDays);
    }
    if (updates.sessionDates) {
      updates.sessionDates = JSON.stringify(updates.sessionDates);
    }

    await course.update(updates);

    res.status(200).json({
      message: "Course updated successfully.",
      data: course,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      message: errorMessage,
      errorDetails,
    });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
        data: null,
        errorDetails: null,
      });
    }

    await course.destroy();

    res.status(200).json({
      message: "Course deleted successfully.",
      data: null,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      message: errorMessage,
      errorDetails,
    });
  }
};
const joinCourse = async (req, res) => {
  const { courseId, studentId } = req.body;

  try {
    // Check if the course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        succeed: false,
        message: "Course not found.",
        data: null,
        errorDetails: null,
      });
    }

    // Check if the student exists
    const student = await User.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        succeed: false,
        message: "Student not found.",
        data: null,
        errorDetails: null,
      });
    }

    // Check if the student is already enrolled in the course
    const existingEnrollment = await ParticipatingStudents.findOne({
      where: { courseId, studentId },
    });
    if (existingEnrollment) {
      return res.status(400).json({
        succeed: false,
        message: "Student is already enrolled in this course.",
        data: null,
        errorDetails: null,
      });
    }

    // Enroll the student in the course
    const enrollment = await ParticipatingStudents.create({
      courseId,
      studentId,
      enrollmentDate: new Date(),
      status: "active",
    });

    res.status(201).json({
      succeed: true,
      message: "Student enrolled in the course successfully.",
      data: enrollment,
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
const getStudentsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const students = await ParticipatingStudents.findAll({
      where: { courseId },
      include: [
        {
          model: User,
          as: "student", // Use the correct alias defined in the association
        },
      ],
    });

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
const getCoursesByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const courses = await ParticipatingStudents.findAll({
      where: { studentId },
      include: [{ model: Course, as: "course" }], // Include course details
    });

    res.status(200).json({
      succeed: true,
      message: "Courses fetched successfully.",
      data: courses,
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
const updateEnrollmentStatus = async (req, res) => {
  const { enrollmentId } = req.params;
  const { status } = req.body;

  try {
    const enrollment = await ParticipatingStudents.findByPk(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({
        succeed: false,
        message: "Enrollment not found.",
        data: null,
        errorDetails: null,
      });
    }

    await enrollment.update({ status });

    res.status(200).json({
      succeed: true,
      message: "Enrollment status updated successfully.",
      data: enrollment,
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
const getEnrollmentsByInstitute = async (req, res) => {
  const { instituteId } = req.params;

  try {
    // Step 1: Find all branches belonging to the institute
    const branches = await Branch.findAll({
      where: { instituteId },
      include: [
        { model: Course, as: "courses",
          include: [
              { model: ParticipatingStudents, as: "enrollments", // ✅ FIXED ALIAS
                include: [{ model: User, as: "student" }] }
          ]
        }
      ]
    });

    // Step 2: Extract enrollments from the branches and courses
    const enrollments = branches.flatMap((branch) =>
      branch.courses.flatMap((course) =>
        course.enrollments.map((enrollment) => ({
          courseId: course.id,
          courseName: course.name,
          enrollmentId: enrollment.id,
          enrollmentDate: enrollment.enrollmentDate,
          status: enrollment.status,
          student: {
            id: enrollment.student.id,
            fullName: enrollment.student.fullName,
            email: enrollment.student.email,
          },
        }))
      )
    );

    res.status(200).json({
      succeed: true,
      message: "Enrollments fetched successfully.",
      data: enrollments,
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

// Generate sessions for a course
const generateSessions = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        succeed: false,
        message: "Course not found.",
        data: null,
        errorDetails: null,
      });
    }

    // Parse schedule days
    const scheduleDays = typeof course.scheduleDays === 'string' 
      ? JSON.parse(course.scheduleDays) 
      : course.scheduleDays;

    if (!scheduleDays || !Array.isArray(scheduleDays) || scheduleDays.length === 0) {
      return res.status(400).json({
        succeed: false,
        message: "Course has no schedule days defined.",
        data: null,
        errorDetails: null,
      });
    }

    // Get existing sessions
    const existingSessions = await Session.findAll({
      where: { courseId },
      attributes: ['date', 'startTime', 'endTime']
    });

    // Convert schedule days to numbers (0 = Sunday, 1 = Monday, etc.)
    const dayMap = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };
    const scheduleDayNumbers = scheduleDays.map(day => 
      dayMap[day.toLowerCase()]
    );

    // Generate sessions
    const startDate = new Date(course.registrationStartDate);
    const endDate = new Date(course.registrationEndDate);
    const sessions = [];
    let currentDate = startDate;

    while (currentDate <= endDate && sessions.length < course.numberOfSessions) {
      const dayOfWeek = currentDate.getDay();
      
      if (scheduleDayNumbers.includes(dayOfWeek)) {
        // Check if session already exists for this date
        const sessionExists = existingSessions.some(session => 
          format(new Date(session.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
        );

        if (!sessionExists) {
          sessions.push({
            date: currentDate,
            startTime: '09:00:00', // Default start time
            endTime: '10:30:00',   // Default end time
            courseId: course.id,
            teacherId: course.teacherId,
            status: 'scheduled'
          });
        }
      }
      
      currentDate = addDays(currentDate, 1);
    }

    // Create sessions in database
    if (sessions.length > 0) {
      await Session.bulkCreate(sessions);
    }

    res.status(200).json({
      succeed: true,
      message: `Generated ${sessions.length} new sessions for the course.`,
      data: sessions,
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
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByInstituteId,
  joinCourse,
  getStudentsByCourse,
  getCoursesByStudent,
  updateEnrollmentStatus,
  getEnrollmentsByInstitute,
  generateSessions
};