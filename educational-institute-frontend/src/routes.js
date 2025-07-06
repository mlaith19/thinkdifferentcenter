import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/AuthFlow/Login";
import ForgotPassword from "./pages/AuthFlow/ForgotPassword";
import ResetPassword from "./pages/AuthFlow/ResetPassword";
import UserManagement from "./pages/SuperAdminFlow/UserManagement";
import InstituteManagement from "./pages/SuperAdminFlow/InstituteManagement";
import CourseManagement from "./pages/InstituteAdminFlow/CourseManagement";
import SessionManagement from "./pages/TeacherFlow/SessionManagement";
import StudentManagement from "./pages/InstituteAdminFlow/StudentManagement";
import TeacherManagement from "./pages/TeacherFlow/TeacherDashboard";
import AccountantManagement from "./pages/AccountantFlow/AccountantDashboard";
import Notifications from "./pages/Notifications";
import Tasks from "./pages/InstituteAdminFlow/Tasks";
import ProtectedRoute from "./components/ProtectedRoute";
import SuperAdminDashboard from "./pages/SuperAdminFlow/SuperAdminDashboard";
import ErrorPage from "./components/ErrorPage";
import CreateInstitute from "./pages/SuperAdminFlow/CreateInstitute";
import InstituteAdminDashboard from "./pages/InstituteAdminFlow/InstituteAdminDashboard";
import InstitutionUsers from "./pages/InstituteAdminFlow/InstitutionUsers";
import StudentDetails from "./pages/InstituteAdminFlow/StudentDetails";
import CourseManageDetails from "./pages/InstituteAdminFlow/CourseManageDetails";
import InstituteReportsScreen from "./pages/InstituteAdminFlow/InstituteReportsManage";
import BranchManagement from "./pages/SuperAdminFlow/BranchManagement";
import PaymentManagement from "./pages/InstituteAdminFlow/PaymentManagement";
import AttendanceManagement from "./pages/InstituteAdminFlow/AttendanceManagement";
import ExpensesManagement from "./pages/InstituteAdminFlow/ExpensesManagement";
import PointsManagement from "./pages/InstituteAdminFlow/PointsManagement";
import ReportsManagement from "./pages/InstituteAdminFlow/ReportsManagement";
import NotificationsManagement from "./pages/InstituteAdminFlow/NotificationsManagement";
import AttendanceTracking from "./pages/TeacherFlow/AttendanceTracking";
import CourseSchedule from "./pages/TeacherFlow/CourseSchedule";
import CourseEnrollment from "./pages/StudentFlow/CourseEnrollment";
import PaymentSlip from "./pages/StudentFlow/PaymentSlip";
import SecreraryTeacherManagement from "./pages/SecretaryFlow/SecreraryTeacherManagement";
import CourseScheduling from "./pages/SecretaryFlow/CourseScheduling";

// New Pages
import InstituteReports from "./pages/SuperAdminFlow/InstituteReports.jsx";
import SystemSettings from "./pages/SuperAdminFlow/SystemSettings.jsx";
import CourseEnrollmentRequests from "./pages/InstituteAdminFlow/CourseEnrollmentRequests.jsx";
import TeacherAssignments from "./pages/InstituteAdminFlow/TeacherAssignments.jsx";
import FinancialSummary from "./pages/InstituteAdminFlow/FinancialSummary.jsx";
import MyCourses from "./pages/TeacherFlow/MyCourses.jsx";
import StudentProgress from "./pages/TeacherFlow/StudentProgress.jsx";
import MaterialsUpload from "./pages/TeacherFlow/MaterialsUpload.jsx";
import MyCoursesStudent from "./pages/StudentFlow/MyCoursesStudent.jsx";
import CourseMaterials from "./pages/StudentFlow/CourseMaterials.jsx";
import AttendanceSummary from "./pages/StudentFlow/AttendanceSummary.jsx";
import PointsRewards from "./pages/StudentFlow/PointsRewards.jsx";
import StudentEnrollment from "./pages/SecretaryFlow/StudentEnrollment.jsx";
import InvoiceManagement from "./pages/SecretaryFlow/InvoiceManagement.jsx";
import AttendanceReports from "./pages/SecretaryFlow/AttendanceReports.jsx";
import FinancialReports from "./pages/AccountantFlow/FinancialReports.jsx";
import PaymentTracking from "./pages/AccountantFlow/PaymentTracking.jsx";
import DiscountManagement from "./pages/AccountantFlow/DiscountManagement.jsx";
import CourseDetails from "./pages/TeacherFlow/CourseDetails";
import StudentDashboard from "./pages/StudentFlow/StudentDashboard";
import StudentCourseDetails from "./pages/StudentFlow/CourseDetails";
import AvailableCourses from "./pages/StudentFlow/AvailableCourses";
import AccountantDashboard from "./pages/AccountantFlow/AccountantDashboard";
import PaymentsManagement from "./pages/AccountantFlow/PaymentsManagement";
import CashFlowManagement from "./pages/AccountantFlow/CashFlowManagement";
import DiscountsManagement from "./pages/AccountantFlow/DiscountsManagement";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/InstituteManagement"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <InstituteManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/institutes/create"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <CreateInstitute />
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
        path="/students/:id"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "institute_admin"]}>
            <StudentDetails />
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
        path="/course-manage-details/:courseId"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <CourseManageDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
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
        path="/InstituteAdminDashboard"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <InstituteAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/institution-users"
        element={
          <ProtectedRoute allowedRoles={["institute_admin", "super_admin"]}>
            <InstitutionUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/branch-management"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <BranchManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-management"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <PaymentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance-management"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <AttendanceManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses-management"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <ExpensesManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/points-management"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <PointsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports-management"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <ReportsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications-management"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <NotificationsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance-tracking"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <AttendanceTracking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course-schedule"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <CourseSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course-enrollment"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <CourseEnrollment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-slip"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <PaymentSlip />
          </ProtectedRoute>
        }
      />
      <Route
        path="/secretary-teacher-management"
        element={
          <ProtectedRoute allowedRoles={["secretary"]}>
            <SecreraryTeacherManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course-scheduling"
        element={
          <ProtectedRoute allowedRoles={["secretary"]}>
            <CourseScheduling />
          </ProtectedRoute>
        }
      />
      <Route
        path="/institute-reports"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <InstituteReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/system-settings"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <SystemSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course-enrollment-requests"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <CourseEnrollmentRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher-assignments"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <TeacherAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/financial-summary"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <FinancialSummary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <MyCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher-management" element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherManagement />
          </ProtectedRoute> 
        } />
      <Route
        path="/student-progress"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <StudentProgress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/materials-upload"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <MaterialsUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-courses-student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyCoursesStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course-materials"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <CourseMaterials />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance-summary"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AttendanceSummary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/points-rewards"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <PointsRewards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-enrollment"
        element={
          <ProtectedRoute allowedRoles={["secretary"]}>
            <StudentEnrollment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice-management"
        element={
          <ProtectedRoute allowedRoles={["secretary"]}>
            <InvoiceManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance-reports"
        element={
          <ProtectedRoute allowedRoles={["secretary"]}>
            <AttendanceReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/financial-reports"
        element={
          <ProtectedRoute allowedRoles={["accountant"]}>
            <FinancialReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-tracking"
        element={
          <ProtectedRoute allowedRoles={["accountant"]}>
            <PaymentTracking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/discount-management"
        element={
          <ProtectedRoute allowedRoles={["accountant"]}>
            <DiscountManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course-details/:courseId"
        element={
          <ProtectedRoute allowedRoles={["teacher", "institute_admin"]}>
            <CourseDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/course-details/:courseId"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentCourseDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/available-courses"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AvailableCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant"
        element={
          <ProtectedRoute allowedRoles={["accountant", "institute_admin"]}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/payments"
        element={
          <ProtectedRoute allowedRoles={["accountant", "institute_admin"]}>
            <PaymentsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/expenses"
        element={
          <ProtectedRoute allowedRoles={["accountant", "institute_admin"]}>
            <ExpensesManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/cash-flow"
        element={
          <ProtectedRoute allowedRoles={["accountant", "institute_admin"]}>
            <CashFlowManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/discounts"
        element={
          <ProtectedRoute allowedRoles={["accountant", "institute_admin"]}>
            <DiscountsManagement />
          </ProtectedRoute>
        }
      />
      <Route path="/404" element={<ErrorPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};