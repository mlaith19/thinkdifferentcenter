import React, { useState, useEffect } from "react";
import api from "../services/api";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks/my-tasks");
      setTasks(response.data);
    } catch (error) {
      setError("Failed to fetch tasks.");
      console.error("Error fetching tasks:", error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-2 flex justify-between items-center">
              <span>{task.title} - {task.status}</span>
              <button
                onClick={() => updateTaskStatus(task.id, "completed")}
                className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
              >
                Mark as Completed
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;