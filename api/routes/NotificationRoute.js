const express = require("express");
const NotificationController = require("../controllers/NotificationController");
const { authenticate } = require("../middlewares/auth_JWT");

const router = express.Router();

// الحصول على الإشعارات الخاصة بالمستخدم
router.get("/my-notifications", authenticate, NotificationController.getUserNotifications);

// تحديث حالة الإشعار (تم القراءة)
router.put("/:notificationId/read", authenticate, NotificationController.markNotificationAsRead);

module.exports = router;