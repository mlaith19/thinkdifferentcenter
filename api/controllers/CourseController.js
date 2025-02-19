const Course = require("../models/Course");
const User = require("../models/User");
const ParticipatingStudents = require("../models/ParticipatingStudents");
const Branch = require("../models/Branch");
const { handleError } = require("../utils/errorHandler");

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
    branchId, teacherId,
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
      branchId,  teacherId,
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
    const courses = await Course.findAll({ where: { instituteId } });

    if (!courses.length) {
      return res.status(404).json({
        succeed: false,
        message: "No courses found for this institute.",
        data: null,
      });
    }

    res.status(200).json({ succeed: true, message: "Courses fetched.", data: courses });
  } catch (error) {
    console.error("Database Error:", error); // Add logging
    res.status(500).json({
      succeed: false,
      message: "Database error",
      errorDetails: error.message,
    });
  }
};

// الحصول على جميع الدورات
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};
const getCourseById = async (req, res) => {
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

    res.status(200).json({
      message: "Course fetched successfully.",
      data: course,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
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

    await course.update(updates);

    res.status(200).json({
      message: "Course updated successfully.",
      data: course,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
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
    res.status(statusCode).json({ message: errorMessage, errorDetails });
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

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,getCoursesByInstituteId ,joinCourse,
  getStudentsByCourse,
  getCoursesByStudent,updateEnrollmentStatus,getEnrollmentsByInstitute
};