import React, { useState, useEffect } from "react";
import api from "../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications/my-notifications");
      setNotifications(response.data);
    } catch (error) {
      setError("Failed to fetch notifications.");
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="mb-2 flex justify-between items-center">
              <span>{notification.message}</span>
              <button
                onClick={() => markAsRead(notification.id)}
                className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
              >
                Mark as Read
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;