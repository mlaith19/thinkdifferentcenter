import React, { useState, useEffect } from "react";
import { decodeToken } from "../../utils/decodeToken";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../services/api"; // Adjust the import path as needed

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  // Decode token to get user information
  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const instituteId = user?.instituteId;
  // Fetch courses and teachers on component mount
  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  // Fetch courses from the API
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/courses", { params: { instituteId } });

      setAssignments(response.data.data);
    } catch (error) {
      setSnackbarMessage("Failed to fetch courses.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch teachers from the API
  const fetchTeachers = async () => {
    try {
      const response = await api.get(`/institute/${instituteId}/teachers`);
      setTeachers(response.data.data);
    } catch (error) {
      setSnackbarMessage("Failed to fetch teachers.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error fetching teachers:", error);
    }
  };

  // Handle assigning a teacher to a course
  const handleAssignTeacher = async (courseId, teacherId) => {
    try {
      const selectedTeacher = teachers.find((teacher) => teacher.id === teacherId);
      if (!selectedTeacher) {
        throw new Error("Teacher not found.");
      }

      // Update the course with the new teacher
      await api.put(`/courses/${courseId}`, {
        teacherId: selectedTeacher.id,
        teacherName: selectedTeacher.fullName,
      });

      // Update the local state to reflect the change
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === courseId
            ? { ...assignment, teacher: selectedTeacher.fullName }
            : assignment
        )
      );

      setSnackbarMessage("Teacher assigned successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to assign teacher.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error assigning teacher:", error);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Teacher Assignments
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Teacher</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.name}</TableCell>
                    <TableCell>{assignment.teacher}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <InputLabel>Assign Teacher</InputLabel>
                        <Select
                          value={assignment.teacherId || ""}
                          onChange={(e) =>
                            handleAssignTeacher(assignment.id, e.target.value)
                          }
                        >
                          {teachers.map((teacher) => (
                            <MenuItem key={teacher.id} value={teacher.id}>
                              {teacher.fullName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeacherAssignments;