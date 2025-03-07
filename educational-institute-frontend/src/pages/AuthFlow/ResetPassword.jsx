import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Container,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import api from "../../services/api"; // Import the API service

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Use the API service to send the reset password request
      const response = await api.post("/users/reset-password", {
        token,
        newPassword,
      });

      setSuccess(response.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          width: "100%",
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        {/* Icon and Title */}
        <Box sx={{ mb: 3 }}>
          <LockIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
            Reset Password
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Enter a new password for your account.
          </Typography>
        </Box>

        {/* Error and Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            Reset Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword;