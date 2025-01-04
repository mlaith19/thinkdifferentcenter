const Task = require("../models/Task");
const Notification = require("../models/Notification");
const { handleError } = require("../utils/errorHandler");

// إنشاء مهمة جديدة
const createTask = async (req, res) => {
  const { title, description, dueDate, assignedTo, relatedEntityType, relatedEntityId } = req.body;
  const createdBy = req.user.id;

  try {
    const newTask = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      createdBy,
      relatedEntityType,
      relatedEntityId,
    });

    // إرسال إشعار للمستخدم المعين
    await Notification.create({
      message: `You have a new task: ${title}`,
      userId: assignedTo,
      type: "task",
      relatedEntityId: newTask.id,
    });

    res.status(201).json({
      message: "Task created successfully.",
      task: newTask,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// تحديث حالة المهمة
const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    await task.update({ status });

    res.status(200).json({
      message: "Task status updated successfully.",
      task,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// الحصول على المهام الخاصة بالمستخدم
const getUserTasks = async (req, res) => {
  const { userId } = req.user;

  try {
    const tasks = await Task.findAll({
      where: { assignedTo: userId },
    });

    res.status(200).json(tasks);
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  createTask,
  updateTaskStatus,
  getUserTasks,
};