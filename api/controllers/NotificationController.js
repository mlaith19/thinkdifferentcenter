const Notification = require("../models/Notification");
const { handleError } = require("../utils/errorHandler");

// الحصول على الإشعارات الخاصة بالمستخدم
const getUserNotifications = async (req, res) => {
  const { userId } = req.user;

  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(notifications);
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// تحديث حالة الإشعار (تم القراءة)
const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    await notification.update({ isRead: true });

    res.status(200).json({
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
};