// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import InstituteManagement from "./pages/InstituteManagement";
import CourseManagement from "./pages/CourseManagement";
import SessionManagement from "./pages/SessionManagement";
import StudentManagement from "./pages/StudentManagement";
import TeacherManagement from "./pages/TeacherManagement";
import AccountantManagement from "./pages/AccountantManagement";
import Notifications from "./pages/Notifications";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ErrorPage from "./components/ErrorPage";
import CreateInstitute from "./pages/CreateInstitute";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/institutes"
            element={
              <ProtectedRoute allowedRoles={["super_admin", ]}>
                <InstituteManagement />
              </ProtectedRoute>
            }
          />
            <Route
            path="/institutes/create"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <CreateInstitute /> {/* Route للصفحة الجديدة */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={["institute_admin"]}>
                <CourseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <SessionManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={["student", "secretary"]}>
                <StudentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountants"
            element={
              <ProtectedRoute allowedRoles={["accountant"]}>
                <AccountantManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
            <Route
            path="/superAdminDashboard"
            element={
              <ProtectedRoute>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />    <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      <Route path="/404" element={<ErrorPage />} />
      <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;