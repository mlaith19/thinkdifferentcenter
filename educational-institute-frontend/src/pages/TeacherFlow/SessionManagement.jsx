import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FloatingActionButton from "../../components/FloatingActionButton";

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    date: "",
    startTime: "",
    endTime: "",
    courseId: "",
    teacherId: "",
  });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get("/session/teacher/1"); // Replace with dynamic teacher ID
      setSessions(response.data);
    } catch (error) {
      setError("Failed to fetch sessions.");
      console.error("Error fetching sessions:", error);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.post("/session/create", newSession);
      setNewSession({
        date: "",
        startTime: "",
        endTime: "",
        courseId: "",
        teacherId: "",
      });
      fetchSessions();
      setOpen(false);
    } catch (error) {
      setError("Failed to create session.");
      console.error("Error creating session:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Session Management
      </Typography>

      <FloatingActionButton onClick={handleClickOpen} label="Add Session" icon={<AddIcon />} />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Session</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newSession.date}
                onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={newSession.startTime}
                onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={newSession.endTime}
                onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course ID"
                value={newSession.courseId}
                onChange={(e) => setNewSession({ ...newSession, courseId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teacher ID"
                value={newSession.teacherId}
                onChange={(e) => setNewSession({ ...newSession, teacherId: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateSession} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Course ID</TableCell>
              <TableCell>Teacher ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.date}</TableCell>
                <TableCell>{session.startTime}</TableCell>
                <TableCell>{session.endTime}</TableCell>
                <TableCell>{session.courseId}</TableCell>
                <TableCell>{session.teacherId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SessionManagement;