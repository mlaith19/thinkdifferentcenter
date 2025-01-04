const Session = require("../models/Session");
const { handleError } = require("../utils/errorHandler");

// إنشاء حصة جديدة
const createSession = async (req, res) => {
  const { date, startTime, endTime, courseId, teacherId } = req.body;

  try {
    const newSession = await Session.create({
      date,
      startTime,
      endTime,
      courseId,
      teacherId,
    });

    res.status(201).json({
      message: "Session created successfully.",
      session: newSession,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// عرض الحصص الخاصة بمدرس معين
const getSessionsByTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const sessions = await Session.findAll({
      where: { teacherId },
      include: [{ model: Course, attributes: ["name", "description"] }],
    });

    res.status(200).json(sessions);
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  createSession,
  getSessionsByTeacher,
};