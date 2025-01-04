const express = require("express");
const AccountantController = require("../controllers/AccountantController");
const { authenticate } = require("../middlewares/auth_JWT");

const router = express.Router();

// إضافة مدفوعات
router.post("/payments", authenticate, AccountantController.addPayment);

// تطبيق خصومات
router.post("/discounts", authenticate, AccountantController.applyDiscount);

// توليد تقارير مالية
router.get("/financial-reports", authenticate, AccountantController.generateFinancialReport);

module.exports = router;