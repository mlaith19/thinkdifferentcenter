const Course = require("../models/Course");
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
    branchId,
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

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,getCoursesByInstituteId
};