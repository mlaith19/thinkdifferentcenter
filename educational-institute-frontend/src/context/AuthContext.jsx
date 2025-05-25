// AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is authenticated on initial load
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (token) {
  //         const response = await api.get("/users/me");  
  //         setUser(response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error checking authentication:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  // Login function
  const login = async (email, password, navigateCallback) => {
    try {
      const response = await api.post("/users/login", { email, password });
      localStorage.setItem("token", response.data.token);

      // هنا بنخزن الـ role في الـ state
      setUser({
        ...response.data.user,
        role: response.data.role, // هنا بنخزن الـ role
      });

      // هنا بنودي المستخدم على الصفحة المناسبة بناءً على الـ role
      if (navigateCallback) {
        switch (response.data.role) {
          case "super_admin":
            navigateCallback("/superAdminDashboard"); // لو سوبر أدمن، اوديه على إدارة المستخدمين
            break;
          case "institute_admin":
            navigateCallback("/InstituteAdminDashboard"); // لو مدير معهد، اوديه على إدارة المعاهد
            break;
          case "secretary":
            navigateCallback("/students"); // لو سكرتير، اوديه على إدارة الطلاب
            break;
          case "teacher":
            navigateCallback("/teacher-management"); // لو مدرس، اوديه على إدارة الحصص
            break;
          case "student":
            navigateCallback("/student-dashboard"); // لو طالب، اوديه على صفحة الطالب
            break;
          case "accountant":
            navigateCallback("/accountants"); // لو محاسب، اوديه على إدارة المحاسبين
            break;
          default:
            navigateCallback("/dashboard"); // لو الدور مش معروف، اوديه على الداشبورد
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);