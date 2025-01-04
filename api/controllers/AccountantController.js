const Payment = require("../models/Payment");
const { handleError } = require("../utils/errorHandler");

// إضافة مدفوعات
const addPayment = async (req, res) => {
  const { studentId, amount, paymentMethod, paymentDate, notes } = req.body;

  try {
    const payment = await Payment.create({
      studentId,
      amount,
      paymentMethod,
      paymentDate,
      notes,
    });

    res.status(201).json({
      message: "Payment added successfully.",
      payment,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// تطبيق خصومات
const applyDiscount = async (req, res) => {
  const { studentId, discountAmount } = req.body;

  try {
    const payment = await Payment.create({
      studentId,
      amount: -discountAmount, // خصم
      paymentMethod: "discount",
      paymentDate: new Date(),
      notes: "Discount applied",
    });

    res.status(201).json({
      message: "Discount applied successfully.",
      payment,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// توليد تقارير مالية
const generateFinancialReport = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  addPayment,
  applyDiscount,
  generateFinancialReport,
};