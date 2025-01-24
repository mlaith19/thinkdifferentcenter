import React from "react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/schedule" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4">View Schedule</h2>
          <p>View your class schedule.</p>
        </Link>
        <Link to="/attendance-points" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4">View Attendance & Points</h2>
          <p>View your attendance and points.</p>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;