import React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const MyCourses = () => {
  const courses = [
    { id: 1, name: "Mathematics 101", students: 30, status: "Ongoing" },
    { id: 2, name: "Physics 101", students: 25, status: "Completed" },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        My Courses
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Course Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Students</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>{course.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default MyCourses;