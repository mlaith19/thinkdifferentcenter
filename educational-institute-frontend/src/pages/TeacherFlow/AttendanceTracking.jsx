import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import { format } from 'date-fns';
import Navbar from "../../components/Navbar";

const AttendanceTracking = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [sessionDetails, setSessionDetails] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: "", message: "" });
  const [savingAttendance, setSavingAttendance] = useState(false);

  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const teacherId = user?.userId;
  const instituteId = user?.instituteId;

  useEffect(() => {
    fetchCourses();
  }, [teacherId]);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/courses/institute/${instituteId}`);
      const filteredCourses = response.data.data.filter(
        (course) => course.teacherId === teacherId
      );
      setCourses(filteredCourses);
    } catch (error) {
      setError("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setSelectedSession("");
    setAttendance([]);
    setSessionDetails(null);
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/courses/${courseId}`);
      const courseData = response.data.data;
      setSessions(courseData.sessions || []);
    } catch (error) {
      setError("Failed to fetch sessions");
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = async (sessionId) => {
    // Clear previous data
    setSelectedSession(sessionId);
    setAttendance([]);
    setSessionDetails(null);
    setLoading(true);
    setError("");

    try {
      // Get session details
      const sessionResponse = await api.get(`/sessions/${sessionId}`);
      setSessionDetails(sessionResponse.data.data);

      // Get attendance records
      const attendanceResponse = await api.get(`/attendance/session/${sessionId}`);
      setAttendance(attendanceResponse.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch attendance data");
      console.error("Error fetching attendance:", error);
      // Clear attendance data on error
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleNotesChange = (studentId, notes) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, notes } : record
      )
    );
  };

  const handleSaveAttendance = async () => {
    setConfirmDialog({
      open: true,
      title: "Confirm Attendance",
      message: "Are you sure you want to save the attendance records? This action cannot be undone."
    });
  };

  const handleConfirmSave = async () => {
    setConfirmDialog({ open: false, title: "", message: "" });
    setSavingAttendance(true);
    setError("");

    try {
      const attendanceData = attendance.map((record) => ({
        studentId: record.studentId,
        status: record.status,
        notes: record.notes,
      }));

      const response = await api.post("/attendance/mark", {
        sessionId: selectedSession,
        attendanceData,
        teacherId: teacherId
      });

      setSnackbar({
        open: true,
        message: response.data.message || "Attendance marked successfully",
        severity: "success",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to save attendance";
      const errorDetails = error.response?.data?.errorDetails?.details || "";
      setSnackbar({
        open: true,
        message: `${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`,
        severity: "error",
      });
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleCancelSave = () => {
    setConfirmDialog({ open: false, title: "", message: "" });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "success";
      case "absent":
        return "error";
      case "late":
        return "warning";
      case "excused":
        return "info";
      default:
        return "default";
    }
  };

  if (loading && !selectedCourse) {
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
          Attendance Tracking
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!selectedCourse ? (
          <Grid container spacing={3}>
            {courses.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Courses Available
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    You don't have any courses assigned to you yet.
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card sx={{ 
                    height: "100%", 
                    transition: "transform 0.2s", 
                    "&:hover": { transform: "scale(1.02)" },
                    boxShadow: 3
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {course.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <GroupIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body2">
                          Students: {course.studentCount || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <EventIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body2">
                          Sessions: {course.sessions?.length || 0}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleCourseSelect(course.id)}
                        fullWidth
                      >
                        Select Course
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        ) : (
          <Box>
            <Button
              variant="outlined"
              onClick={() => setSelectedCourse(null)}
              sx={{ mb: 3 }}
            >
              Back to Courses
            </Button>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Select Session
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Session</InputLabel>
                    <Select
                      value={selectedSession}
                      onChange={(e) => handleSessionSelect(e.target.value)}
                      label="Session"
                    >
                      {sessions.map((session) => (
                        <MenuItem key={session.id} value={session.id}>
                          {format(new Date(session.date), "MMM dd, yyyy")} - {session.startTime}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {sessionDetails && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Session Details
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <EventIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body2">
                          Date: {format(new Date(sessionDetails.date), "MMMM dd, yyyy")}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body2">
                          Time: {sessionDetails.startTime} - {sessionDetails.endTime}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <GroupIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body2">
                          Students: {attendance.length}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                {selectedSession && (
                  <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Typography variant="h6">
                        Mark Attendance
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={handleSaveAttendance}
                        disabled={savingAttendance || loading || attendance.length === 0}
                        startIcon={savingAttendance ? <CircularProgress size={20} /> : null}
                      >
                        {savingAttendance ? "Saving..." : "Save Attendance"}
                      </Button>
                    </Box>

                    {loading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : error ? (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                      </Alert>
                    ) : attendance.length === 0 ? (
                      <Alert severity="info" sx={{ mb: 3 }}>
                        No students enrolled in this session.
                      </Alert>
                    ) : (
                      <TableContainer>
                        <Table size={isMobile ? "small" : "medium"}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Student Name</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Notes</TableCell>
                              <TableCell>Last Updated</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {attendance.map((record) => (
                              <TableRow key={record.studentId}>
                                <TableCell>{record.studentName}</TableCell>
                                <TableCell>
                                  <FormControl size="small">
                                    <Select
                                      value={record.status}
                                      onChange={(e) => handleAttendanceChange(record.studentId, e.target.value)}
                                      sx={{ minWidth: 120 }}
                                    >
                                      <MenuItem value="present">
                                        <Chip 
                                          label="Present" 
                                          size="small" 
                                          color="success" 
                                          sx={{ width: '100%' }}
                                        />
                                      </MenuItem>
                                      <MenuItem value="absent">
                                        <Chip 
                                          label="Absent" 
                                          size="small" 
                                          color="error" 
                                          sx={{ width: '100%' }}
                                        />
                                      </MenuItem>
                                      <MenuItem value="late">
                                        <Chip 
                                          label="Late" 
                                          size="small" 
                                          color="warning" 
                                          sx={{ width: '100%' }}
                                        />
                                      </MenuItem>
                                      <MenuItem value="excused">
                                        <Chip 
                                          label="Excused" 
                                          size="small" 
                                          color="info" 
                                          sx={{ width: '100%' }}
                                        />
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    size="small"
                                    value={record.notes || ""}
                                    onChange={(e) => handleNotesChange(record.studentId, e.target.value)}
                                    placeholder="Add notes..."
                                    fullWidth
                                  />
                                </TableCell>
                                <TableCell>
                                  {record.markedAt ? (
                                    <Tooltip title={`Marked by: ${record.markedBy}`}>
                                      <Typography variant="body2" color="text.secondary">
                                        {format(new Date(record.markedAt), "MMM dd, yyyy HH:mm")}
                                      </Typography>
                                    </Tooltip>
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      Not marked
                                    </Typography>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Dialog
          open={confirmDialog.open}
          onClose={handleCancelSave}
        >
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <Typography>{confirmDialog.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelSave}>Cancel</Button>
            <Button onClick={handleConfirmSave} variant="contained" color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AttendanceTracking;