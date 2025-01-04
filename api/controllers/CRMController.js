const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Points = require("../models/Points");
const { handleError } = require("../utils/errorHandler");

// تحليلات الطلاب
const getStudentAnalytics = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await User.findByPk(studentId);
    const attendance = await Attendance.findAll({ where: { studentId } });
    const points = await Points.findAll({ where: { studentId } });

    res.status(200).json({ student, attendance, points });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  getStudentAnalytics,
};