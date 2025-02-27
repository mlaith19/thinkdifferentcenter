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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const PointsManagement = () => {
  const [points, setPoints] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPoint, setCurrentPoint] = useState({
    id: "",
    studentId: "",
    courseId: "",
    points: "",
    rewardId: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPoints();
    fetchStudents();
    fetchCourses();
    fetchRewards();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await api.get("/points");
      setPoints(response.data);
    } catch (error) {
      console.error("Failed to fetch points:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await api.get("/rewards");
      setRewards(response.data);
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
    }
  };

  const handleOpenDialog = (point = null) => {
    setCurrentPoint(point || { id: "", studentId: "", courseId: "", points: "", rewardId: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSavePoint = async () => {
    try {
      if (currentPoint.id) {
        await api.put(`/points/${currentPoint.id}`, currentPoint);
      } else {
        await api.post("/points", currentPoint);
      }
      fetchPoints();
      handleCloseDialog();
      setSnackbarMessage("Point saved successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to save point:", error);
      setSnackbarMessage("Failed to save point.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeletePoint = async (id) => {
    try {
      await api.delete(`/points/${id}`);
      fetchPoints();
      setSnackbarMessage("Point deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to delete point:", error);
      setSnackbarMessage("Failed to delete point.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Points and Rewards Management
      </Typography>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
        Add Points
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Reward</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {points.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{students.find((s) => s.id === point.studentId)?.fullName}</TableCell>
                <TableCell>{courses.find((c) => c.id === point.courseId)?.name}</TableCell>
                <TableCell>{point.points}</TableCell>
                <TableCell>{rewards.find((r) => r.id === point.rewardId)?.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(point)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeletePoint(point.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentPoint.id ? "Edit Points" : "Add Points"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Student</InputLabel>
            <Select
              value={currentPoint.studentId}
              onChange={(e) => setCurrentPoint({ ...currentPoint, studentId: e.target.value })}
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={currentPoint.courseId}
              onChange={(e) => setCurrentPoint({ ...currentPoint, courseId: e.target.value })}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Points"
            value={currentPoint.points}
            onChange={(e) => setCurrentPoint({ ...currentPoint, points: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Reward</InputLabel>
            <Select
              value={currentPoint.rewardId}
              onChange={(e) => setCurrentPoint({ ...currentPoint, rewardId: e.target.value })}
            >
              {rewards.map((reward) => (
                <MenuItem key={reward.id} value={reward.id}>
                  {reward.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSavePoint} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PointsManagement;