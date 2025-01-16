// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { decodeToken } from "../utils/decodeToken";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeToken(token) : null;
  const role = decodedToken?.role;

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Think
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
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
            <Button color="inherit" component={Link} to="/institutes">
              Institutes
            </Button>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;