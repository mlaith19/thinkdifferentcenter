import React, { useState, useEffect } from "react";
import api from "../services/api";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/student/attendance-points");
      setStudents(response.data);
    } catch (error) {
      setError("Failed to fetch students.");
      console.error("Error fetching students:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Student List</h2>
        <ul>
          {students.map((student) => (
            <li key={student.id} className="mb-2">
              <span>
                {student.name} - Attendance: {student.attendance}, Points: {student.points}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentManagement;