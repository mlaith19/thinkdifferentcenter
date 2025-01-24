import React, { useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";

const CourseEnrollmentRequests = () => {
  const [requests, setRequests] = useState([
    { id: 1, studentName: "John Doe", course: "Mathematics 101", status: "Pending" },
    { id: 2, studentName: "Jane Smith", course: "Physics 101", status: "Pending" },
  ]);

  const handleApprove = (id) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: "Approved" } : request
    ));
  };

  const handleReject = (id) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: "Rejected" } : request
    ));
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Course Enrollment Requests
      </Typography>

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
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.studentName}</TableCell>
                  <TableCell>{request.course}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      startIcon={<CheckIcon />}
                      onClick={() => handleApprove(request.id)}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CloseIcon />}
                      onClick={() => handleReject(request.id)}
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
    </Box>
  );
};

export default CourseEnrollmentRequests;