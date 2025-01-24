import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import api from "../../services/api";

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [reportType, setReportType] = useState("financial");

  useEffect(() => {
    fetchReports();
  }, [reportType]);

  const fetchReports = async () => {
    try {
      const response = await api.get(`/reports?type=${reportType}`);
      setReports(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Reports Management
      </Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Report Type</InputLabel>
        <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <MenuItem value="financial">Financial Reports</MenuItem>
          <MenuItem value="attendance">Attendance Reports</MenuItem>
          <MenuItem value="course">Course Reports</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportsManagement;