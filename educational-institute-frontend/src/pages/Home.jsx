import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Educational Institute Management System</h1>
      <p className="text-lg mb-8">Manage your institute efficiently with our platform.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Login
        </Link>
        <Link to="/dashboard" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;