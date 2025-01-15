import React, { useState, useEffect } from "react";
import api from "../services/api";

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    date: "",
    startTime: "",
    endTime: "",
    courseId: "",
    teacherId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get("/session/teacher/1"); // Replace with dynamic teacher ID
      setSessions(response.data);
    } catch (error) {
      setError("Failed to fetch sessions.");
      console.error("Error fetching sessions:", error);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.post("/session/create", newSession);
      setNewSession({
        date: "",
        startTime: "",
        endTime: "",
        courseId: "",
        teacherId: "",
      });
      fetchSessions();
    } catch (error) {
      setError("Failed to create session.");
      console.error("Error creating session:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Session Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleCreateSession} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <input
          type="date"
          placeholder="Date"
          value={newSession.date}
          onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="time"
          placeholder="Start Time"
          value={newSession.startTime}
          onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="time"
          placeholder="End Time"
          value={newSession.endTime}
          onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Course ID"
          value={newSession.courseId}
          onChange={(e) => setNewSession({ ...newSession, courseId: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Teacher ID"
          value={newSession.teacherId}
          onChange={(e) => setNewSession({ ...newSession, teacherId: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Create Session
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Session List</h2>
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

export default SessionManagement;