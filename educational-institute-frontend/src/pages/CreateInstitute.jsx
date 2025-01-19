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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Grid,
} from "@mui/material";
import {
  School as SchoolIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
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
  const [showTrialPopup, setShowTrialPopup] = useState(false); // State for trial popup
  const [formValues, setFormValues] = useState(null); // Store form values for submission after confirmation

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Institute name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    adminName: Yup.string().required("Admin name is required"),
    startDate: Yup.date().nullable().typeError("Invalid date format"),
    endDate: Yup.date()
      .nullable()
      .min(Yup.ref("startDate"), "End date must be after start date")
      .typeError("Invalid date format"),
    address: Yup.string().required("Address is required"),
    phone: Yup.string().required("Phone is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      adminName: "",
      startDate: "",
      endDate: "",
      address: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // Check if dates are empty
      if (!values.startDate || !values.endDate) {
        setFormValues(values); // Store form values
        setShowTrialPopup(true); // Show trial popup
        return;
      }

      // If dates are provided, submit the form
      submitForm(values);
    },
  });

  const submitForm = async (values) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/institute/create", values);
      if (response.data.succeed) {
        console.log(response.data);
        setSuccess(true);
        setTimeout(() => {
          navigate("/superAdminDashboard"); // Redirect after success
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create institute. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleTrialPopupConfirm = () => {
    setShowTrialPopup(false); // Close the popup
    submitForm(formValues); // Submit the form with stored values
  };

  const handleTrialPopupCancel = () => {
    setShowTrialPopup(false); // Close the popup
    setFormValues(null); // Clear stored values
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          mb: 4,
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "primary.main", fontWeight: "bold", mb: 4 }}
        >
          <SchoolIcon sx={{ verticalAlign: "middle", mr: 2, fontSize: "2.5rem" }} />
          Create New Institute
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Institute Name */}
            <Grid item xs={12} md={6}>
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
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
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
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} md={6}>
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
              />
            </Grid>

            {/* Admin Name */}
            <Grid item xs={12} md={6}>
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
              />
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                helperText={formik.touched.startDate && formik.errors.startDate}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                helperText={formik.touched.endDate && formik.errors.endDate}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                margin="normal"
                required
                InputProps={{
                  startAdornment: <LocationIcon sx={{ color: "action.active", mr: 1 }} />,
                }}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                margin="normal"
                required
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ color: "action.active", mr: 1 }} />,
                }}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ width: "100%", maxWidth: "200px", py: 1.5, fontSize: "1rem" }}
            >
              {loading ? <CircularProgress size={24} /> : "Create Institute"}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Success message */}
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

      {/* Error message */}
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

      {/* Trial Popup */}
      <Dialog open={showTrialPopup} onClose={handleTrialPopupCancel}>
        <DialogTitle>No Dates Provided</DialogTitle>
        <DialogContent>
          <DialogContentText>
            By not providing start and end dates, this institution will be given a 1-month trial period. Do you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTrialPopupCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleTrialPopupConfirm} color="primary" autoFocus>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateInstitute;