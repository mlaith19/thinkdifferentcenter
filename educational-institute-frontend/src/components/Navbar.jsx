import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { decodeToken } from "../utils/decodeToken";
import LogoutIcon from "@mui/icons-material/Logout"; // Import logout icon

const Navbar = () => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeToken(token) : null;
  const role = decodedToken?.role;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Redirect to login page
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main", boxShadow: 3 }}>
      <Toolbar>
        {/* Brand Name or Logo */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            fontFamily: "monospace",
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
          component={Link}
          to="/"
        >
          Think
        </Typography>

        {/* Navigation Links */}
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
            <Button color="inherit" component={Link} to="/institution-users">
              Users
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

          {/* Logout Button (Visible for All Roles Except Unauthenticated Users) */}
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