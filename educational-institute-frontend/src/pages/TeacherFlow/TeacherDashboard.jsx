import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Tabs, Tab, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Grid, Snackbar, Alert, Checkbox, FormControl, InputLabel, Select, MenuItem,
  useMediaQuery, List, ListItem, ListItemText 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { decodeToken } from "../../utils/decodeToken";
import TeacherReplacementForm from "./TeacherReplacementForm";

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
  const [openReplacementDialog, setOpenReplacementDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [teachingHourMethod, setTeachingHourMethod] = useState('60min');
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
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    fetchCourses();
    fetchSessions();
  }, [teacherId]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/courses", {
        params: { instituteId }
      });
      const filteredCourses = response.data.data.filter(
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

  const fetchSessions = async () => {
    try {
      const response = await api.get(`/teacher/${teacherId}/sessions`);
      setSessions(response.data);
    } catch (error) {
      setError("Failed to fetch sessions.");
      console.error("Error fetching sessions:", error);
    }
  };

  const calculateTeachingHours = (startTime, endTime) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    
    if (teachingHourMethod === '45min') {
      return (totalMinutes / 45).toFixed(2);
    }
    return (totalMinutes / 60).toFixed(2);
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const sessionData = {
        ...newSession,
        teacherId,
        teachingHours: calculateTeachingHours(newSession.startTime, newSession.endTime),
        teachingHourMethod
      };
      
      await api.post("/session/create", sessionData);
      setNewSession({
        date: "",
        startTime: "",
        endTime: "",
        courseId: ""
      });
      setOpenSessionDialog(false);
      setSnackbarMessage("Session created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchSessions();
    } catch (error) {
      setError("Failed to create session.");
      console.error("Error creating session:", error);
    }
  };

  const handleToggleAttendance = (id) => {
    setStudents(students.map((student) => 
      student.id === id ? { ...student, present: !student.present } : student
    ));
  };

  const handleSaveAttendance = async (courseId, sessionId) => {
    try {
      const attendanceData = students.map((student) => ({
        studentId: student.id,
        status: student.present ? "present" : "absent",
        sessionId,
        courseId
      }));
      
      await api.post("/attendance", { 
        attendance: attendanceData,
        teachingHourMethod
      });
      
      setSnackbarMessage("Attendance saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      
      await api.post("/financial/update-teacher-payment", { 
        teacherId,
        sessionId 
      });
    } catch (error) {
      setError("Failed to save attendance.");
      console.error("Error saving attendance:", error);
    }
  };

  const generateSessions = async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/generate-sessions`, {
        teacherId,
        teachingHourMethod
      });
      setSessions(response.data);
      setSnackbarMessage("Sessions generated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setError("Failed to generate sessions.");
      console.error("Error generating sessions:", error);
    }
  };

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

        {tabValue === 0 && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>My Courses</Typography>
            {isMobile ? (
              <List>
                {courses.map((course) => (
                  <ListItem key={course.id}>
                    <ListItemText 
                      primary={course.name}
                      secondary={`Students: ${course.studentCount} | Status: ${course.status}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
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
                        <TableCell>{course.studentCount}</TableCell>
                        <TableCell>{course.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {tabValue === 1 && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>Course Schedule</Typography>
              <Button 
                variant="contained" 
                onClick={() => generateSessions(courses[0]?.id)}
                disabled={!courses.length}
              >
                Generate Sessions
              </Button>
            </Box>
            {isMobile ? (
              <List>
                {sessions.map((session) => (
                  <ListItem key={session.id}>
                    <ListItemText 
                      primary={session.courseName}
                      secondary={`${session.date} | ${session.startTime}-${session.endTime}`}
                    />
                    <Button 
                      size="small" 
                      startIcon={<SwapHorizIcon />}
                      onClick={() => {
                        setSelectedSession(session);
                        setOpenReplacementDialog(true);
                      }}
                    >
                      Replace
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Teaching Hours</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.courseName}</TableCell>
                        <TableCell>{session.date}</TableCell>
                        <TableCell>{session.startTime}-{session.endTime}</TableCell>
                        <TableCell>
                          {calculateTeachingHours(session.startTime, session.endTime)} ({teachingHourMethod})
                        </TableCell>
                        <TableCell>
                          <Button 
                            startIcon={<SwapHorizIcon />}
                            onClick={() => {
                              setSelectedSession(session);
                              setOpenReplacementDialog(true);
                            }}
                          >
                            Replace Teacher
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {/* Other tabs remain similar but updated with mobile views */}
        
        <Dialog open={openSessionDialog} onClose={() => setOpenSessionDialog(false)} maxWidth="md" fullWidth>
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
                <FormControl fullWidth>
                  <InputLabel>Teaching Hour Method</InputLabel>
                  <Select
                    value={teachingHourMethod}
                    onChange={(e) => setTeachingHourMethod(e.target.value)}
                  >
                    <MenuItem value="60min">60 Minutes (Standard Hour)</MenuItem>
                    <MenuItem value="45min">45 Minutes (Teaching Hour)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Course ID"
                  value={newSession.courseId}
                  onChange={(e) => setNewSession({ ...newSession, courseId: e.target.value })}
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

        <TeacherReplacementForm
          open={openReplacementDialog}
          onClose={() => setOpenReplacementDialog(false)}
          originalTeacher={{ id: teacherId, name: user?.fullName }}
          session={selectedSession}
        />

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
    </Box>
  );
};

export default TeacherDashboard;