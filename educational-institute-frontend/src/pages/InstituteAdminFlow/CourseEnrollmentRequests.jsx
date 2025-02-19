import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";import { decodeToken } from "../../utils/decodeToken";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";

const CourseEnrollmentRequests = () => {
  const location = useLocation();
 const token = localStorage.getItem("token"); const user = decodeToken(token);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch enrollments on component mount
  useEffect(() => {
    if (user.instituteId) fetchEnrollments();
  }, [user.instituteId]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/institute/${user.instituteId}/enrollments`);
      setEnrollments(response.data.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setSnackbar({ open: true, message: "Failed to fetch enrollments.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updateEnrollmentStatus = async (enrollmentId, newStatus) => {
    try {
      await api.put(`/enrollment/${enrollmentId}`, { status: newStatus });
      setEnrollments((prev) =>
        prev.map((enrollment) =>
          enrollment.enrollmentId === enrollmentId ? { ...enrollment, status: newStatus } : enrollment
        )
      );
      setSnackbar({ open: true, message: `Enrollment ${newStatus} successfully!`, severity: "success" });
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbar({ open: true, message: "Failed to update status.", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Course Enrollment Requests
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.enrollmentId}>
                    <TableCell>{enrollment.student.fullName}</TableCell>
                    <TableCell>{enrollment.courseName}</TableCell>
                    <TableCell>{enrollment.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={() => updateEnrollmentStatus(enrollment.enrollmentId, "Approved")}
                        sx={{ mr: 1 }}
                        disabled={enrollment.status === "Approved"}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<CloseIcon />}
                        onClick={() => updateEnrollmentStatus(enrollment.enrollmentId, "Rejected")}
                        disabled={enrollment.status === "Rejected"}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseEnrollmentRequests;
