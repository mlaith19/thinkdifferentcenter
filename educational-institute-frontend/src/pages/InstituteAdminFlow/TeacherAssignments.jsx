import React, { useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([
    { id: 1, course: "Mathematics 101", teacher: "Dr. Smith" },
    { id: 2, course: "Physics 101", teacher: "Dr. Johnson" },
  ]);

  const handleAssignTeacher = (id, teacher) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, teacher } : assignment
    ));
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Teacher Assignments
      </Typography>

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
                  <TableCell>{assignment.course}</TableCell>
                  <TableCell>{assignment.teacher}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel>Assign Teacher</InputLabel>
                      <Select
                        value={assignment.teacher}
                        onChange={(e) => handleAssignTeacher(assignment.id, e.target.value)}
                      >
                        <MenuItem value="Dr. Smith">Dr. Smith</MenuItem>
                        <MenuItem value="Dr. Johnson">Dr. Johnson</MenuItem>
                        <MenuItem value="Dr. Brown">Dr. Brown</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TeacherAssignments;