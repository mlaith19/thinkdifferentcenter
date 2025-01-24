import React, { useState, useEffect } from "react";
import api from "../../services/api";

const TeacherManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get("/teacher/sessions");
      setSessions(response.data);
    } catch (error) {
      setError("Failed to fetch sessions.");
      console.error("Error fetching sessions:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Teacher Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Sessions</h2>
        <ul>
          {sessions.map((session) => (
            <li key={session.id} className="mb-2">
              <span>
                {session.courseName} - {session.date} ({session.startTime} - {session.endTime})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherManagement;