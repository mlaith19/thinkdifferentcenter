import React, { useState, useEffect } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const SessionManagement = ({ teacherId }) => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    date: "",
    startTime: "",
    endTime: "",
    courseId: "",
  });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get(`/teacher/${teacherId}/sessions`);
        setSessions(response.data);
      } catch (error) {
        setError("Failed to fetch sessions.");
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [teacherId]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.post("/session/create", { ...newSession, teacherId });
      setNewSession({ date: "", startTime: "", endTime: "", courseId: "" });
      setOpen(false);
      setSnackbarOpen(true);
    } catch (error) {
      setError("Failed to create session.");
      console.error("Error creating session:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}
      >
        Session Management
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Add Session
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
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
                onChange={(e) =>
                  setNewSession({ ...newSession, date: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={newSession.startTime}
                onChange={(e) =>
                  setNewSession({ ...newSession, startTime: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={newSession.endTime}
                onChange={(e) =>
                  setNewSession({ ...newSession, endTime: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course ID"
                value={newSession.courseId}
                onChange={(e) =>
                  setNewSession({ ...newSession, courseId: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
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
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.date}</TableCell>
                <TableCell>{session.startTime}</TableCell>
                <TableCell>{session.endTime}</TableCell>
                <TableCell>{session.courseId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Session created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SessionManagement;
