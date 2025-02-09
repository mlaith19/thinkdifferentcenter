import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Switch,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import FloatingActionButton from "../../components/FloatingActionButton";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    branchId: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  useEffect(() => {
    if (user && user.instituteId) {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      const response = await api.get(`/student/institute/${user.instituteId}/students`);
      setStudents(response.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClickOpen = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      setNewStudent(student);
    } else {
      setSelectedStudent(null);
      setNewStudent({
        fullName: "",
        email: "",
        phone: "",
        birthDate: "",
        branchId: "",
      });
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setNewStudent({
      fullName: "",
      email: "",
      phone: "",
      birthDate: "",
      branchId: "",
    });
  };

  const handleSave = async () => {
    try {
      if (selectedStudent) {
        await api.put(`/students/${selectedStudent.id}`, newStudent);
        setSnackbarMessage("Student updated successfully.");
      } else {
        await api.post(`/institute/${user.instituteId}/students`, newStudent);
        setSnackbarMessage("Student added successfully.");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchStudents();
      handleClose();
    } catch (error) {
      setSnackbarMessage("Failed to save student.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error saving student:", error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      setSnackbarMessage("Student deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchStudents();
    } catch (error) {
      setSnackbarMessage("Failed to delete student.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error deleting student:", error);
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await api.put(`/students/${id}`, { isActive: !isActive });
      setSnackbarMessage("Student status updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchStudents();
    } catch (error) {
      setSnackbarMessage("Failed to update student status.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating student status:", error);
    }
  };

  const handleRowClick = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Student Management
      </Typography>
      {/* Search Field */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search students..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
          }}
        />
      </Box>
      {/* Students Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} hover onClick={() => handleRowClick(student.id)} sx={{ cursor: "pointer" }}>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.birthDate}</TableCell>
                <TableCell>
                  <Chip label={student.isActive ? "Active" : "Inactive"} color={student.isActive ? "success" : "error"} />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpen(student);
                    }}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStudent(student.id);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Switch
                    checked={student.isActive}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(student.id, student.isActive);
                    }}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Floating Action Button for Adding Student */}
      <FloatingActionButton
        key={"addStudent"}
        onClick={() => handleClickOpen()}
        icon={<AddIcon />}
        label="Add Student"
      />
      {/* Add/Edit Student Dialog */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{selectedStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newStudent.fullName}
            onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={newStudent.phone}
            onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Birth Date"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newStudent.birthDate}
            onChange={(e) => setNewStudent({ ...newStudent, birthDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for Notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentManagement;