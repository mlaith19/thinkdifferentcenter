const Session = require("../models/Session");
const Attendance = require("../models/Attendance");
const Points = require("../models/Points");
const { handleError } = require("../utils/errorHandler");

 
const getTeacherSessions = async (req, res) => {
  const { userId } = req.user; // يتم استخراج userId من التوكن

  try {
    const sessions = await Session.findAll({
      where: { teacherId: userId }, // نفترض أن الحصص مرتبطة بالمدرس عبر teacherId
      include: [{ model: Course, attributes: ["name", "description"] }],
    });

    res.status(200).json(sessions);
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

 
const markAttendance = async (req, res) => {
  const { sessionId, studentId, status } = req.body;

  try {
    const attendance = await Attendance.create({
      sessionId,
      studentId,
      status,
    });

    res.status(201).json({
      message: "Attendance marked successfully.",
      attendance,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// حساب عدد ساعات التدريس
const calculateTeachingHours = async (req, res) => {
  const { userId } = req.user;
  const { method } = req.query; // method: "full_hour" أو "teaching_hour"

  try {
    const sessions = await Session.findAll({
      where: { teacherId: userId },
    });

    let totalMinutes = 0;
    sessions.forEach((session) => {
      const startTime = new Date(`1970-01-01T${session.startTime}`);
      const endTime = new Date(`1970-01-01T${session.endTime}`);
      const duration = (endTime - startTime) / (1000 * 60); // تحويل إلى دقائق

      if (method === "teaching_hour") {
        totalMinutes += duration * 0.75; // 45 دقيقة لكل ساعة تدريس
      } else {
        totalMinutes += duration; // 60 دقيقة لكل ساعة كاملة
      }
    });

    const totalHours = totalMinutes / 60;
    res.status(200).json({ totalHours });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// إضافة نقاط للطلاب
const addPoints = async (req, res) => {
  const { studentId, points, reason } = req.body;

  try {
    const newPoints = await Points.create({
      studentId,
      points,
      reason,
    });

    res.status(201).json({
      message: "Points added successfully.",
      points: newPoints,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  getTeacherSessions,
  markAttendance,
  calculateTeachingHours,
  addPoints,
};