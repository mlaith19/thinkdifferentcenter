import React from "react";
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
  Checkbox,
  Button,
} from "@mui/material";

const AttendanceTracking = () => {
  // Dummy data for students and attendance
  const students = [
    { id: 1, name: "John Doe", present: false },
    { id: 2, name: "Jane Smith", present: true },
    { id: 3, name: "Alice Johnson", present: false },
  ];

  const handleToggleAttendance = (id) => {
    console.log(`Toggled attendance for student ${id}`);
  };

  return (
    <Box sx={{ p: 4 }}>
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
                  <TableCell>{student.name}</TableCell>
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
          <Button variant="contained" color="primary">
            Save Attendance
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AttendanceTracking;