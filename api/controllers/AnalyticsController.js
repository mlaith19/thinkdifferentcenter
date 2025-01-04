const StudentPerformance = require("../models/StudentPerformance");
const TeacherPerformance = require("../models/TeacherPerformance");
const FinancialReport = require("../models/FinancialReport");
const { handleError } = require("../utils/errorHandler");

 
const analyzeStudentPerformance = async (req, res) => {
  const { studentId, courseId } = req.query;

  try {
    const performance = await StudentPerformance.findOne({
      where: { studentId, courseId },
    });

    if (!performance) {
      return res.status(404).json({ message: "Performance data not found." });
    }

    res.status(200).json(performance);
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

 
const analyzeTeacherPerformance = async (req, res) => {
  const { teacherId } = req.query;

  try {
    const performance = await TeacherPerformance.findOne({
      where: { teacherId },
    });

    if (!performance) {
      return res.status(404).json({ message: "Performance data not found." });
    }

    res.status(200).json(performance);
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

 
const generateFinancialReport = async (req, res) => {
  const { instituteId, period, startDate, endDate } = req.body;

  try {
    
    const totalRevenue = 10000;  
    const totalExpenses = 5000;  
    const netProfit = totalRevenue - totalExpenses;

    const report = await FinancialReport.create({
      instituteId,
      totalRevenue,
      totalExpenses,
      netProfit,
      period,
      startDate,
      endDate,
    });

    res.status(201).json({
      message: "Financial report generated successfully.",
      report,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  analyzeStudentPerformance,
  analyzeTeacherPerformance,
  generateFinancialReport,
};