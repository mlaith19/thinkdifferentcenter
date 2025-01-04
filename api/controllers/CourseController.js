const Course = require("../models/Course");
const { handleError } = require("../utils/errorHandler");

// إنشاء دورة جديدة
const createCourse = async (req, res) => {
  const { name, description, paymentType, price, registrationStartDate, registrationEndDate, minAge, maxAge, instituteId, branchId } = req.body;

  try {
    const newCourse = await Course.create({
      name,
      description,
      paymentType,
      price,
      registrationStartDate,
      registrationEndDate,
      minAge,
      maxAge,
      instituteId,
      branchId,
    });

    res.status(201).json({
      message: "Course created successfully.",
      course: newCourse,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
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

module.exports = {
  createCourse,
  getAllCourses,
};