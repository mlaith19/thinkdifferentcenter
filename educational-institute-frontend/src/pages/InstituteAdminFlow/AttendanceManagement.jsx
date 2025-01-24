import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../../services/api";

const AttendanceManagement = () => {
  const [attendances, setAttendances] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState({
    id: "",
    studentId: "",
    sessionId: "",
    date: "",
    status: "",
  });

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await api.get("/attendances");
      setAttendances(response.data);
    } catch (error) {
      console.error("Failed to fetch attendances:", error);
    }
  };

  const handleOpenDialog = (attendance = null) => {
    setCurrentAttendance(attendance || { id: "", studentId: "", sessionId: "", date: "", status: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveAttendance = async () => {
    try {
      if (currentAttendance.id) {
        await api.put(`/attendances/${currentAttendance.id}`, currentAttendance);
      } else {
        await api.post("/attendances", currentAttendance);
      }
      fetchAttendances();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save attendance:", error);
    }
  };

  const handleDeleteAttendance = async (id) => {
    try {
      await api.delete(`/attendances/${id}`);
      fetchAttendances();
    } catch (error) {
      console.error("Failed to delete attendance:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Attendance Management
      </Typography>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
        Add Attendance
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Session ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendances.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell>{attendance.studentId}</TableCell>
                <TableCell>{attendance.sessionId}</TableCell>
                <TableCell>{attendance.date}</TableCell>
                <TableCell>{attendance.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(attendance)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteAttendance(attendance.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentAttendance.id ? "Edit Attendance" : "Add Attendance"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Student ID"
            value={currentAttendance.studentId}
            onChange={(e) => setCurrentAttendance({ ...currentAttendance, studentId: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Session ID"
            value={currentAttendance.sessionId}
            onChange={(e) => setCurrentAttendance({ ...currentAttendance, sessionId: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentAttendance.date}
            onChange={(e) => setCurrentAttendance({ ...currentAttendance, date: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Status"
            value={currentAttendance.status}
            onChange={(e) => setCurrentAttendance({ ...currentAttendance, status: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveAttendance} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceManagement;