import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the API service to send the forgot password request
      const response = await api.post("/users/forgot-password", { email });
      setSuccess(response.data.message);
      setError("");
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
            Forgot Password
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Enter your email to reset your password.
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
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Send Reset Link
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;