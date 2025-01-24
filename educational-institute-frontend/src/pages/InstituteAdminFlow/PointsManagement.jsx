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

const PointsManagement = () => {
  const [points, setPoints] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPoint, setCurrentPoint] = useState({
    id: "",
    studentId: "",
    points: "",
    reward: "",
  });

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await api.get("/points");
      setPoints(response.data);
    } catch (error) {
      console.error("Failed to fetch points:", error);
    }
  };

  const handleOpenDialog = (point = null) => {
    setCurrentPoint(point || { id: "", studentId: "", points: "", reward: "" });
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
    } catch (error) {
      console.error("Failed to save point:", error);
    }
  };

  const handleDeletePoint = async (id) => {
    try {
      await api.delete(`/points/${id}`);
      fetchPoints();
    } catch (error) {
      console.error("Failed to delete point:", error);
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
              <TableCell>Student ID</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Reward</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {points.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.studentId}</TableCell>
                <TableCell>{point.points}</TableCell>
                <TableCell>{point.reward}</TableCell>
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
          <TextField
            fullWidth
            label="Student ID"
            value={currentPoint.studentId}
            onChange={(e) => setCurrentPoint({ ...currentPoint, studentId: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Points"
            value={currentPoint.points}
            onChange={(e) => setCurrentPoint({ ...currentPoint, points: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Reward"
            value={currentPoint.reward}
            onChange={(e) => setCurrentPoint({ ...currentPoint, reward: e.target.value })}
          />
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
    </Box>
  );
};

export default PointsManagement;