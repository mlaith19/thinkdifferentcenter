import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Snackbar, Alert } from "@mui/material";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AttendanceTracking = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get(`/courses/${courseId}/students`);
        setStudents(response.data.data.map(student => ({ ...student, present: false })));
      } catch (error) {
        setError("Failed to fetch students.");
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  const handleToggleAttendance = (id) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, present: !student.present } : student
    ));
  };

  const handleSaveAttendance = async () => {
    try {
      await api.post("/attendance", {
        courseId,
        attendance: students.map(student => ({ studentId: student.id, status: student.present ? "present" : "absent" }))
      });
      setSnackbarOpen(true);
    } catch (error) {
      setError("Failed to save attendance.");
      console.error("Error saving attendance:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default",  }}>
      <Navbar />
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Attendance Tracking
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Present</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={student.present}
                      onChange={() => handleToggleAttendance(student.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleSaveAttendance}>
            Save Attendance
          </Button>
        </Box>
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Attendance saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttendanceTracking;