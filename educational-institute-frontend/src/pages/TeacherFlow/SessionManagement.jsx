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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { decodeToken } from "../../utils/decodeToken";

const SessionManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sessions, setSessions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSession, setCurrentSession] = useState({
    date: "",
    startTime: "",
    endTime: "",
    status: "scheduled",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get teacher ID from token
  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const teacherId = user?.userId;

  useEffect(() => {
    fetchCourses();
  }, [teacherId]);

  const fetchCourses = async () => {
    try {
      const response = await api.get(`/courses/institute/${user?.instituteId}`);
      const teacherCourses = response.data.data.filter(
        (course) => course.teacherId === teacherId
      );
      setCourses(teacherCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch courses",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setSessions(response.data.data.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch sessions",
        severity: "error",
      });
    }
  };

  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);
    if (courseId) {
      fetchSessions(courseId);
    } else {
      setSessions([]);
    }
  };

  const handleOpenDialog = (session = null) => {
    if (session) {
      setEditMode(true);
      setCurrentSession(session);
    } else {
      setEditMode(false);
      setCurrentSession({
        date: "",
        startTime: "",
        endTime: "",
        status: "scheduled",
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentSession({
      date: "",
      startTime: "",
      endTime: "",
      status: "scheduled",
    });
  };

  const handleSaveSession = async () => {
    try {
      if (editMode) {
        const response = await api.put(`/sessions/${currentSession.id}`, {
          ...currentSession,
          courseId: selectedCourse,
        });
        setSnackbar({
          open: true,
          message: response.data.message || "Session updated successfully",
          severity: "success",
        });
      } else {
        const response = await api.post("/sessions/create", {
          ...currentSession,
          courseId: selectedCourse,
          teacherId,
        });
        setSnackbar({
          open: true,
          message: response.data.message || "Session created successfully",
          severity: "success",
        });
      }
      fetchSessions(selectedCourse);
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving session:", error);
      const errorMessage = error.response?.data?.message || `Failed to ${editMode ? "update" : "create"} session`;
      const errorDetails = error.response?.data?.errorDetails?.details || "";
      setSnackbar({
        open: true,
        message: `${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`,
        severity: "error",
      });
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        const response = await api.delete(`/sessions/${sessionId}`);
        fetchSessions(selectedCourse);
        setSnackbar({
          open: true,
          message: response.data.message || "Session deleted successfully",
          severity: "success",
        });
      } catch (error) {
        console.error("Error deleting session:", error);
        const errorMessage = error.response?.data?.message || "Failed to delete session";
        const errorDetails = error.response?.data?.errorDetails?.details || "";
        setSnackbar({
          open: true,
          message: `${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`,
          severity: "error",
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "scheduled":
        return "info";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            fontWeight: "bold", 
            color: "primary.main",
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          Session Management
        </Typography>

        <FormControl fullWidth sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={handleCourseChange}
            label="Select Course"
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedCourse && (
          <>
            <Box sx={{ 
              mb: 3, 
              display: "flex", 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: "space-between", 
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ textAlign: isMobile ? 'center' : 'left' }}
              >
                Sessions for {courses.find(c => c.id === selectedCourse)?.name}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                fullWidth={isMobile}
              >
                Add Session
              </Button>
            </Box>

            <TableContainer 
              component={Paper}
              sx={{
                overflowX: 'auto',
                '& .MuiTableCell-root': {
                  whiteSpace: 'nowrap',
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1, sm: 1.5 }
                }
              }}
            >
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{format(new Date(session.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{session.startTime}</TableCell>
                      <TableCell>{session.endTime}</TableCell>
                      <TableCell>
                        <Chip
                          label={session.status.toUpperCase()}
                          color={getStatusColor(session.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Delete Session">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteSession(session.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        <Dialog 
          open={open} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              m: { xs: 1, sm: 2 },
              width: { xs: 'calc(100% - 16px)', sm: 'auto' }
            }
          }}
        >
          <DialogTitle>
            {editMode ? "Edit Session" : "Create New Session"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={currentSession.date}
                  onChange={(e) =>
                    setCurrentSession({ ...currentSession, date: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={currentSession.startTime}
                  onChange={(e) =>
                    setCurrentSession({
                      ...currentSession,
                      startTime: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={currentSession.endTime}
                  onChange={(e) =>
                    setCurrentSession({
                      ...currentSession,
                      endTime: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={currentSession.status}
                    onChange={(e) =>
                      setCurrentSession({
                        ...currentSession,
                        status: e.target.value,
                      })
                    }
                    label="Status"
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveSession} variant="contained">
              {editMode ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SessionManagement;
