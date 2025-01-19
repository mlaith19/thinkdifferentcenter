import React, { useState } from "react";
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
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import FloatingActionButton from "../components/FloatingActionButton";

const StudentManagement = () => {
  const navigate = useNavigate();

  // Static student data for testing
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      birthDate: "2000-01-01",
      points: 85,
      attendance: 90,
      isActive: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      birthDate: "2001-05-15",
      points: 92,
      attendance: 95,
      isActive: true,
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "555-555-5555",
      birthDate: "1999-12-25",
      points: 78,
      attendance: 80,
      isActive: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    points: "",
    attendance: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Open dialog for adding/editing a student
  const handleClickOpen = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      setNewStudent(student);
    } else {
      setSelectedStudent(null);
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        birthDate: "",
        points: "",
        attendance: "",
      });
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setNewStudent({
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      points: "",
      attendance: "",
    });
  };

  // Save or update student
  const handleSave = () => {
    if (selectedStudent) {
      // Update existing student
      const updatedStudents = students.map((student) =>
        student.id === selectedStudent.id ? { ...student, ...newStudent } : student
      );
      setStudents(updatedStudents);
      setSnackbarMessage("Student updated successfully.");
    } else {
      // Add new student
      const newStudentWithId = { ...newStudent, id: students.length + 1 };
      setStudents([...students, newStudentWithId]);
      setSnackbarMessage("Student added successfully.");
    }
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    handleClose();
  };

  // Delete a student
  const handleDeleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
    setSnackbarMessage("Student deleted successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // Toggle student status
  const handleToggleStatus = (id) => {
    const updatedStudents = students.map((student) =>
      student.id === id ? { ...student, isActive: !student.isActive } : student
    );
    setStudents(updatedStudents);
    setSnackbarMessage("Student status updated successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // Navigate to student details
  const handleRowClick = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close snackbar
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
              <TableCell>Points</TableCell>
              <TableCell>Attendance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow
                key={student.id}
                hover
                onClick={() => handleRowClick(student.id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.birthDate}</TableCell>
                <TableCell>{student.points}</TableCell>
                <TableCell>{student.attendance}%</TableCell>
                <TableCell>
                  <Chip
                    label={student.isActive ? "Active" : "Inactive"}
                    color={student.isActive ? "success" : "error"}
                  />
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
                      handleToggleStatus(student.id);
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
        onClick={() => handleClickOpen()} // Open dialog for adding a new student
        icon={<AddIcon />}
        label="Add Student" // Add a label to the FAB
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
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
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
          <TextField
            margin="dense"
            label="Points"
            fullWidth
            type="number"
            value={newStudent.points}
            onChange={(e) => setNewStudent({ ...newStudent, points: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Attendance"
            fullWidth
            type="number"
            value={newStudent.attendance}
            onChange={(e) => setNewStudent({ ...newStudent, attendance: e.target.value })}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentManagement;