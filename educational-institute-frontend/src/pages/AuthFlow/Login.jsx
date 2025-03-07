import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, navigate);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
      console.error("Login failed:", error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
        {/* App Name and Icon */}
        <Box sx={{ mb: 3 }}>
          <LockIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
            Think
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back! Please log in to continue.
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            Login
          </Button>

          {/* Forgot Password Link */}
          <Typography
            variant="body2"
            sx={{ mt: 2, textAlign: "center", color: "primary.main" }}
          >
            <Link
              to="/forgot-password"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Forgot Password?
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;