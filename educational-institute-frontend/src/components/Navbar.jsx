import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { decodeToken } from "../utils/decodeToken";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeToken(token) : null;
  const role = decodedToken?.role;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main", boxShadow: 3 }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <LockIcon sx={{ fontSize: 40, color: "white", mr: 2 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "white", fontFamily: "monospace", letterSpacing: ".3rem" }}
            component={Link}
            to="/"
          >
            Think
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {role === "super_admin" && (
            <>
              <Button color="inherit" component={Link} to="/superAdminDashboard">
                Super Admin Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/users">
                Users
              </Button>
              <Button color="inherit" component={Link} to="/branches">
                Branches
              </Button>
              <Button color="inherit" component={Link} to="/institute-reports">
                Institute Reports
              </Button>
              <Button color="inherit" component={Link} to="/system-settings">
                System Settings
              </Button>
            </>
          )}
          {role === "institute_admin" && (
            <>
              <Button color="inherit" component={Link} to="/institution-users">
                Users
              </Button>
              <Button color="inherit" component={Link} to="/students">
                Students
              </Button>
              <Button color="inherit" component={Link} to="/courses">
                Courses
              </Button>
              <Button color="inherit" component={Link} to="/institute-reports">
                Reports
              </Button>
              <Button color="inherit" component={Link} to="/payments">
                Payments
              </Button>
              <Button color="inherit" component={Link} to="/attendances">
                Attendances
              </Button>
              <Button color="inherit" component={Link} to="/expenses">
                Expenses
              </Button>
              <Button color="inherit" component={Link} to="/points">
                Points
              </Button>
              <Button color="inherit" component={Link} to="/notifications">
                Notifications
              </Button>
              <Button color="inherit" component={Link} to="/course-enrollment-requests">
                Enrollment Requests
              </Button>
              <Button color="inherit" component={Link} to="/teacher-assignments">
                Teacher Assignments
              </Button>
              <Button color="inherit" component={Link} to="/financial-summary">
                Financial Summary
              </Button>
            </>
          )}
          {role === "secretary" && (
            <>
              <Button color="inherit" component={Link} to="/students">
                Students
              </Button>
              <Button color="inherit" component={Link} to="/student-enrollment">
                Student Enrollment
              </Button>
              <Button color="inherit" component={Link} to="/invoice-management">
                Invoice Management
              </Button>
              <Button color="inherit" component={Link} to="/attendance-reports">
                Attendance Reports
              </Button>
            </>
          )}
          {role === "teacher" && (
            <>
              <Button color="inherit" component={Link} to="/sessions">
                Sessions
              </Button>
              <Button color="inherit" component={Link} to="/my-courses">
                My Courses
              </Button>
              <Button color="inherit" component={Link} to="/student-progress">
                Student Progress
              </Button>
              <Button color="inherit" component={Link} to="/materials-upload">
                Materials Upload
              </Button>
            </>
          )}
          {role === "student" && (
            <>
              <Button color="inherit" component={Link} to="/students">
                Students
              </Button>
              <Button color="inherit" component={Link} to="/my-courses-student">
                My Courses
              </Button>
              <Button color="inherit" component={Link} to="/course-materials">
                Course Materials
              </Button>
              <Button color="inherit" component={Link} to="/attendance-summary">
                Attendance Summary
              </Button>
              <Button color="inherit" component={Link} to="/points-rewards">
                Points & Rewards
              </Button>
            </>
          )}
          {role === "accountant" && (
            <>
              <Button color="inherit" component={Link} to="/accountants">
                Accountants
              </Button>
              <Button color="inherit" component={Link} to="/financial-reports">
                Financial Reports
              </Button>
              <Button color="inherit" component={Link} to="/payment-tracking">
                Payment Tracking
              </Button>
              <Button color="inherit" component={Link} to="/discount-management">
                Discount Management
              </Button>
            </>
          )}
          {!token && (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}

          {token && (
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;