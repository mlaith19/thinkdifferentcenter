import React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

const InstituteReports = () => {
  // Static data for institute reports
  const reports = [
    { id: 1, name: "Institute A", students: 100, courses: 10, revenue: 50000 },
    { id: 2, name: "Institute B", students: 150, courses: 15, revenue: 75000 },
    { id: 3, name: "Institute C", students: 200, courses: 20, revenue: 100000 },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Institute Reports
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Download Report
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Institute Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Students</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Courses</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.students}</TableCell>
                  <TableCell>{report.courses}</TableCell>
                  <TableCell>${report.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default InstituteReports;