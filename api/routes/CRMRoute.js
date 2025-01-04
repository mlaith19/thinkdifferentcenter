const express = require("express");
const CRMController = require("../controllers/CRMController");
const { authenticate } = require("../middlewares/auth_JWT");

const router = express.Router();

// تحليلات الطلاب
router.get("/student-analytics/:studentId", authenticate, CRMController.getStudentAnalytics);

module.exports = router;