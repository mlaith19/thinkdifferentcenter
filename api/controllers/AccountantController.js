const { Op } = require("sequelize");
const Payment = require("../models/Payment");
const Expense = require("../models/Expense");
const Discount = require("../models/Discount");
const MonthlyCashFlow = require("../models/MonthlyCashFlow");
const User = require("../models/User");
const Course = require("../models/Course");
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

// Get financial reports for a specific period
const getFinancialReports = async (req, res) => {
  try {
    const { instituteId, branchId, startDate, endDate } = req.query;
    
    // Build where clause based on available fields
    const whereClause = {
      ...(instituteId && { instituteId }),
      ...(branchId && { branchId }),
      paymentDate: {
        [Op.between]: [startDate, endDate],
      },
    };

    // Get all payments in the period
    const payments = await Payment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "RecordedBy",
          attributes: ["fullName", "email"],
        },
      ],
    });

    // Get all expenses in the period
    const expenses = await Expense.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "RecordedBy",
          attributes: ["fullName", "email"],
        },
      ],
    });

    // Calculate totals
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Get payment method breakdown
    const paymentMethods = {
      cash: payments.filter(p => p.paymentMethod === 'cash').reduce((sum, p) => sum + p.amount, 0),
      check: payments.filter(p => p.paymentMethod === 'check').reduce((sum, p) => sum + p.amount, 0),
      bank_transfer: payments.filter(p => p.paymentMethod === 'bank_transfer').reduce((sum, p) => sum + p.amount, 0),
      visa: payments.filter(p => p.paymentMethod === 'visa').reduce((sum, p) => sum + p.amount, 0),
      bit: payments.filter(p => p.paymentMethod === 'bit').reduce((sum, p) => sum + p.amount, 0),
    };

    res.status(200).json({
      succeed: true,
      message: "Financial report generated successfully",
      data: {
        totalRevenue,
        totalExpenses,
        netProfit,
        paymentMethods,
        payments,
        expenses,
      },
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

// Create a new expense
const createExpense = async (req, res) => {
  try {
    const {
      instituteId,
      branchId,
      vendor,
      amount,
      paymentMethod,
      paymentDate,
      category,
      description,
      receiptNumber,
    } = req.body;

    const expense = await Expense.create({
      instituteId,
      branchId,
      vendor,
      amount,
      paymentMethod,
      paymentDate,
      category,
      description,
      receiptNumber,
      recordedBy: req.user.id,
      status: 'pending',
    });

    res.status(201).json({
      succeed: true,
      message: "Expense created successfully",
      data: expense,
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

// Create a new discount
const createDiscount = async (req, res) => {
  try {
    const {
      instituteId,
      branchId,
      studentId,
      courseId,
      amount,
      percentage,
      type,
      reason,
      startDate,
      endDate,
    } = req.body;

    const discount = await Discount.create({
      instituteId,
      branchId,
      studentId,
      courseId,
      amount,
      percentage,
      type,
      reason,
      startDate,
      endDate,
      approvedBy: req.user.id,
      approvedAt: new Date(),
    });

    res.status(201).json({
      succeed: true,
      message: "Discount created successfully",
      data: discount,
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

// Get monthly cash flow
const getMonthlyCashFlow = async (req, res) => {
  try {
    const { instituteId, branchId, month, year } = req.query;

    const cashFlow = await MonthlyCashFlow.findOne({
      where: {
        instituteId,
        branchId,
        month,
        year,
      },
    });

    if (!cashFlow) {
      return res.status(404).json({
        succeed: false,
        message: "Monthly cash flow not found",
        data: null,
        errorDetails: null,
      });
    }

    res.status(200).json({
      succeed: true,
      message: "Monthly cash flow retrieved successfully",
      data: cashFlow,
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

// Update monthly cash flow
const updateMonthlyCashFlow = async (req, res) => {
  try {
    const {
      instituteId,
      branchId,
      month,
      year,
      cashIn,
      checkIn,
      bankTransferIn,
      visaIn,
      bitIn,
      cashOut,
      checkOut,
      bankTransferOut,
      visaOut,
      bitOut,
    } = req.body;

    const [cashFlow, created] = await MonthlyCashFlow.findOrCreate({
      where: {
        instituteId,
        branchId,
        month,
        year,
      },
      defaults: {
        cashIn: 0,
        checkIn: 0,
        bankTransferIn: 0,
        visaIn: 0,
        bitIn: 0,
        cashOut: 0,
        checkOut: 0,
        bankTransferOut: 0,
        visaOut: 0,
        bitOut: 0,
        recordedBy: req.user.id,
      },
    });

    if (!created) {
      await cashFlow.update({
        cashIn,
        checkIn,
        bankTransferIn,
        visaIn,
        bitIn,
        cashOut,
        checkOut,
        bankTransferOut,
        visaOut,
        bitOut,
      });
    }

    // Calculate totals
    const totalIn = cashIn + checkIn + bankTransferIn + visaIn + bitIn;
    const totalOut = cashOut + checkOut + bankTransferOut + visaOut + bitOut;
    const netFlow = totalIn - totalOut;

    await cashFlow.update({
      totalIn,
      totalOut,
      netFlow,
    });

    res.status(200).json({
      succeed: true,
      message: "Monthly cash flow updated successfully",
      data: cashFlow,
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

// Get payment tracking
const getPaymentTracking = async (req, res) => {
  try {
    const { instituteId, branchId, startDate, endDate } = req.query;

    const payments = await Payment.findAll({
      where: {
        instituteId,
        ...(branchId && { branchId }),
        paymentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["fullName", "email"],
        },
        {
          model: Course,
          attributes: ["name", "price"],
        },
      ],
    });

    // Get discounts for the same period
    const discounts = await Discount.findAll({
      where: {
        instituteId,
        ...(branchId && { branchId }),
        startDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["fullName", "email"],
        },
        {
          model: Course,
          attributes: ["name"],
        },
      ],
    });

    res.status(200).json({
      succeed: true,
      message: "Payment tracking data retrieved successfully",
      data: {
        payments,
        discounts,
      },
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
  addPayment,
  applyDiscount,
  generateFinancialReport,
  getFinancialReports,
  createExpense,
  createDiscount,
  getMonthlyCashFlow,
  updateMonthlyCashFlow,
  getPaymentTracking,
};