import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { decodeToken } from "../../utils/decodeToken";

const TeacherDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [newSession, setNewSession] = useState({
    date: "",
    startTime: "",
    endTime: "",
    courseId: "",
  });

  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const teacherId = user?.userId;
  const instituteId = user?.instituteId;

  // Fetch courses and sessions on component mount
  useEffect(() => {
    fetchCourses();
    fetchSessions();
  }, [teacherId]);

  // Fetch courses assigned to the teacher
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/courses", { params: { instituteId } });
      const filteredCourses = response.data.filter(
        (course) => course.teacherId === teacherId
      );
      setCourses(filteredCourses);
    } catch (error) {
      setError("Failed to fetch courses.");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sessions for the teacher
  const fetchSessions = async () => {
    try {
      const response = await api.get(`/teacher/${teacherId}/sessions`);
      setSessions(response.data);
    } catch (error) {
      setError("Failed to fetch sessions.");
      console.error("Error fetching sessions:", error);
    }
  };

  // Handle creating a new session
  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.post("/session/create", { ...newSession, teacherId });
      setNewSession({ date: "", startTime: "", endTime: "", courseId: "" });
      setOpenSessionDialog(false);
      setSnackbarMessage("Session created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchSessions(); // Refresh sessions after creation
    } catch (error) {
      setError("Failed to create session.");
      console.error("Error creating session:", error);
    }
  };

  // Handle toggling student attendance
  const handleToggleAttendance = (id) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  // Handle saving attendance
  const handleSaveAttendance = async (courseId) => {
    try {
      await api.post("/attendance", {
        courseId,
        attendance: students.map((student) => ({
          studentId: student.id,
          status: student.present ? "present" : "absent",
        })),
      });
      setSnackbarMessage("Attendance saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setError("Failed to save attendance.");
      console.error("Error saving attendance:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
          Teacher Dashboard
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label="My Courses" />
          <Tab label="Course Schedule" />
          <Tab label="Attendance Tracking" />
          <Tab label="Session Management" />
        </Tabs>

        {/* My Courses Tab */}
        {tabValue === 0 && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
              My Courses
            </Typography>
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
        )}

        {/* Course Schedule Tab */}
        {tabValue === 1 && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
              Course Schedule
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.courseName}</TableCell>
                      <TableCell>{session.date}</TableCell>
                      <TableCell>
                        {session.startTime} - {session.endTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Attendance Tracking Tab */}
        {tabValue === 2 && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
              Attendance Tracking
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Present</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={student.present}
                          onChange={() => handleToggleAttendance(student.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSaveAttendance(courses[0]?.id)}
              >
                Save Attendance
              </Button>
            </Box>
          </Paper>
        )}

        {/* Session Management Tab */}
        {tabValue === 3 && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
              Session Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenSessionDialog(true)}
            >
              Add Session
            </Button>
            <Dialog
              open={openSessionDialog}
              onClose={() => setOpenSessionDialog(false)}
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
                <Button onClick={() => setOpenSessionDialog(false)} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleCreateSession} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
            <TableContainer sx={{ mt: 4 }}>
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
          </Paper>
        )}
      </Box>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeacherDashboard;