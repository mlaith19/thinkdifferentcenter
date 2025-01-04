const express = require("express");
const TaskController = require("../controllers/TaskController");
const { authenticate } = require("../middlewares/auth_JWT");

const router = express.Router();

// إنشاء مهمة جديدة
router.post("/create", authenticate, TaskController.createTask);

// تحديث حالة المهمة
router.put("/:taskId/status", authenticate, TaskController.updateTaskStatus);

// الحصول على المهام الخاصة بالمستخدم
router.get("/my-tasks", authenticate, TaskController.getUserTasks);

module.exports = router;