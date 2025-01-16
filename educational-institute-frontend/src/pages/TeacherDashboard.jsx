import React from "react";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/sessions" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4">Manage Sessions</h2>
          <p>View and manage your teaching sessions.</p>
        </Link>
        <Link to="/students" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4">View Students</h2>
          <p>View and manage students in your sessions.</p>
        </Link>
      </div>
    </div>
  );
};

export default TeacherDashboard;