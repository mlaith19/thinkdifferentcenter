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
              <Button color="inherit" component={Link} to="/reports">
                Reports
              </Button>
            </>
          )}
          {role === "secretary" && (
            <Button color="inherit" component={Link} to="/students">
              Students
            </Button>
          )}
          {role === "teacher" && (
            <Button color="inherit" component={Link} to="/sessions">
              Sessions
            </Button>
          )}
          {role === "student" && (
            <Button color="inherit" component={Link} to="/students">
              Students
            </Button>
          )}
          {role === "accountant" && (
            <Button color="inherit" component={Link} to="/accountants">
              Accountants
            </Button>
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