// src/pages/CreateInstitute.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  School as SchoolIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../services/api";

const CreateInstitute = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // تحقق من صحة الحقول باستخدام Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Institute name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    adminName: Yup.string().required("Admin name is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      adminName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await api.post("/institute/create", values);
        if (response.data.succeed) {
            console.log(response.data);
          setSuccess(true);
          setTimeout(() => {
            navigate("/superAdminDashboard"); // توجيه المستخدم إلى صفحة المعاهد بعد النجاح
          }, 1500); // تأخير التوجيه لعرض رسالة النجاح
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to create institute. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ color: "primary.main" }}>
          <SchoolIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: "2rem" }} />
          Create New Institute
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Institute Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            required
            InputProps={{
              startAdornment: <SchoolIcon sx={{ color: "action.active", mr: 1 }} />,
            }}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            required
            InputProps={{
              startAdornment: <EmailIcon sx={{ color: "action.active", mr: 1 }} />,
            }}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            required
            InputProps={{
              startAdornment: <LockIcon sx={{ color: "action.active", mr: 1 }} />,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Admin Name"
            name="adminName"
            value={formik.values.adminName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            required
            InputProps={{
              startAdornment: <PersonIcon sx={{ color: "action.active", mr: 1 }} />,
            }}
            error={formik.touched.adminName && Boolean(formik.errors.adminName)}
            helperText={formik.touched.adminName && formik.errors.adminName}
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ width: "100%", maxWidth: "200px", py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "Create Institute"}
            </Button>
          </Box>
        </form>
      </Box>

      {/* رسالة النجاح */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Institute created successfully!
        </Alert>
      </Snackbar>

      {/* رسالة الخطأ */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateInstitute;