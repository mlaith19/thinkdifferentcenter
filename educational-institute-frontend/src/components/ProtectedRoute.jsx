// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { decodeToken } from "../utils/decodeToken"; // استيراد وظيفة فك التشفير

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token"); // جلب الـ token من localStorage

  if (!token) {
    return <Navigate to="/login" replace />; // إذا لم يكن هناك token، توجيه إلى صفحة تسجيل الدخول
  }

  const decodedToken = decodeToken(token); // فك تشفير الـ token

  if (!decodedToken) {
    return <Navigate to="/login" replace />; // إذا فشل فك التشفير، توجيه إلى صفحة تسجيل الدخول
  }

  const userRole = decodedToken.role; // استخراج الـ role من الـ token

  // إذا كانت الصفحة تتطلب أدوارًا محددة ولم يكن المستخدم لديه الدور المطلوب
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />; // توجيه إلى الداشبورد
  }

  return children; // إذا كان كل شيء صحيحًا، عرض الصفحة المطلوبة
};

export default ProtectedRoute;