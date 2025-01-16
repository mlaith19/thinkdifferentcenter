// pages/Home.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/decodeToken";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeToken(token);

      if (decodedToken && decodedToken.role) {
        switch (decodedToken.role) {
          case "super_admin":
            navigate("/superAdminDashboard");
            break;
          case "institute_admin":
            navigate("/institutes");
            break;
          case "secretary":
            navigate("/students");
            break;
          case "teacher":
            navigate("/sessions");
            break;
          case "student":
            navigate("/students");
            break;
          case "accountant":
            navigate("/accountants");
            break;
          default:
            navigate("/");
        }
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the "Think" Institute Management System</h1>
      <p className="text-lg mb-8">Manage your institute efficiently with our platform.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;