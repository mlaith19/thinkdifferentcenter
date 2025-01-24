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
} from "@mui/material";

const CourseSchedule = () => {
  // Dummy data for course schedule
  const courses = [
    { id: 1, name: "Mathematics", date: "2023-10-01", time: "10:00 AM" },
    { id: 2, name: "Physics", date: "2023-10-02", time: "11:00 AM" },
    { id: 3, name: "Chemistry", date: "2023-10-03", time: "12:00 PM" },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Course Schedule
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.date}</TableCell>
                  <TableCell>{course.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CourseSchedule;