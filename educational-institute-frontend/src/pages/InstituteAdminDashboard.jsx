import React from "react";
import { Link } from "react-router-dom";

const InstituteAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Institute Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/courses" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4">Manage Courses</h2>
          <p>View and manage courses in your institute.</p>
        </Link>
        <Link to="/students" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4">Manage Students</h2>
          <p>View and manage students in your institute.</p>
        </Link>
        <Link to="/teachers" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4">Manage Teachers</h2>
          <p>View and manage teachers in your institute.</p>
        </Link>
      </div>
    </div>
  );
};

export default InstituteAdminDashboard;