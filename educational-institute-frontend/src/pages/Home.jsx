import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/decodeToken";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School"; // Import school icon

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

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
            navigate("/InstituteAdminDashboard");
            break;
          case "secretary":
            navigate("/students");
            break;
          case "teacher":
            navigate("/teacher-management");
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
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 6,
          borderRadius: 2,
          textAlign: "center",
          bgcolor: "background.paper",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        {/* App Name and Icon */}
        <Box sx={{ mb: 4 }}>
          <SchoolIcon sx={{ fontSize: 60, color: "primary.main" }} />
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mt: 2,
              fontFamily: "monospace",
              letterSpacing: ".3rem",
            }}
          >
            Think
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mt: 1 }}>
            Institute Management System
          </Typography>
        </Box>

        {/* Welcome Message */}
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Welcome to Think
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your institute efficiently with our platform.
        </Typography>

        {/* Login Button */}
        <Button
          component={Link}
          to="/login"
          variant="contained"
          size="large"
          sx={{
            py: 1.5,
            px: 4,
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Home;