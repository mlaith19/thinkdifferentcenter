const FinancialReport = require("../models/FinancialReport");
const { handleError } = require("../utils/errorHandler");

// الحصول على التقارير المالية
const getFinancialReports = async (req, res) => {
  const { instituteId } = req.query;

  try {
    const reports = await FinancialReport.findAll({
      where: { instituteId },
      order: [["startDate", "DESC"]],
    });

    res.status(200).json(reports);
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  getFinancialReports,
};