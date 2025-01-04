const express = require("express");
const TeacherController = require("../controllers/TeacherController");
const { authenticate } = require("../middlewares/auth_JWT");

const router = express.Router();

// عرض الحصص المكلف بها المدرس
router.get("/sessions", authenticate, TeacherController.getTeacherSessions);

// إضافة الحضور والغياب
router.post("/attendance", authenticate, TeacherController.markAttendance);

// حساب عدد ساعات التدريس
router.get("/teaching-hours", authenticate, TeacherController.calculateTeachingHours);

// إضافة نقاط للطلاب
router.post("/points", authenticate, TeacherController.addPoints);

module.exports = router;