const Institute = require("../models/Institute");
const User = require("../models/User");
const Branch = require("../models/Branch");const { handleError } = require("../utils/errorHandler");

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
          model: Branch, as: "branch",
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
  getStudentsByInstituteId,
  addStudent,
  updateStudent,
  deleteStudent,
};