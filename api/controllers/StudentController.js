const Session = require("../models/Session");
const Attendance = require("../models/Attendance");
const Points = require("../models/Points");
const { handleError } = require("../utils/errorHandler");

// عرض جدول الحصص للطالب
const getStudentSchedule = async (req, res) => {
  const { userId } = req.user;

  try {
    const sessions = await Session.findAll({
      where: { courseId: req.user.courseId }, // نفترض أن الطالب مرتبط بدورة
      include: [{ model: Course, attributes: ["name", "description"] }],
    });

    res.status(200).json(sessions);
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// عرض الحضور والنقاط للطالب
const getStudentAttendanceAndPoints = async (req, res) => {
  const { userId } = req.user;

  try {
    const attendance = await Attendance.findAll({
      where: { studentId: userId },
    });

    const points = await Points.findAll({
      where: { studentId: userId },
    });

    res.status(200).json({ attendance, points });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  getStudentSchedule,
  getStudentAttendanceAndPoints,
};