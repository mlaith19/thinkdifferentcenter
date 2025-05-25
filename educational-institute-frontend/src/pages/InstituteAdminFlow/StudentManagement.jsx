import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Fab,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";

const StudentManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudentDialogOpen, setNewStudentDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ fullName: "", email: "", phone: "", birthDate: "", password: "", });
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionStudentId, setActionStudentId] = useState(null);

  const token = localStorage.getItem("token");
  const user = useMemo(() => decodeToken(token), [token]);

  // Fetch students on component mount
  useEffect(() => {
    if (user?.instituteId) {
      fetchStudents();
    }
  }, [user?.instituteId, token]);

  // Fetch students from the API
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/student/institute/${user.instituteId}/students`);
      if (!response.data.data || response.data.data.length === 0) {
        setSnackbarMessage("No students found.");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
      setStudents(response.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setSnackbarMessage("Failed to fetch students.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [user?.instituteId]);

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Open edit dialog for a student
  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEditDialogOpen(true);
  };

  // Save edited student details
  const handleEditSave = async () => {
    try {
      await api.put(`/users/${selectedStudent.id}`, selectedStudent);
      fetchStudents();
      setEditDialogOpen(false);
      setSnackbarMessage("Student updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to update student.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating student:", error);
    }
  };

  // Delete a student
  const handleDeleteStudent = async (studentId) => {
    try {
      await api.delete(`/users/delete/${studentId}`);
      fetchStudents();
      setSnackbarMessage("Student deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete student.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error deleting student:", error);
    }
  };

  // Toggle student status
  const handleToggleStatus = async (student) => {
    try {
      const updatedStudent = { ...student, isActive: !student.isActive };
      await api.put(`/users/${student.id}`, updatedStudent);
      fetchStudents();
    } catch (error) {
      setSnackbarMessage("Failed to update student status.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating student status:", error);
    }
  };

  // Open new student dialog
  const handleNewStudentClick = () => {
    setNewStudentDialogOpen(true);
  };

  // Save new student
  const handleNewStudentSave = async () => {
    try {
      const emailParts = newStudent.email.split(/[.@]/);
      const generatedUsername = emailParts[0];
      await api.post("/users/create", { ...newStudent, instituteId: user.instituteId, username: generatedUsername, role: "student", branchId: newStudent.branchId, });
      fetchStudents();
      setNewStudentDialogOpen(false);
      setNewStudent({ fullName: "", email: "", phone: "", birthDate: "", password: "" });
      setSnackbarMessage("Student created successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to create student.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error creating student:", error);
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Open confirmation dialog
  const handleConfirmAction = (type, studentId) => {
    setActionType(type);
    setActionStudentId(studentId);
    setConfirmDialogOpen(true);
  };

  // Handle confirmed action
  const handleConfirmedAction = async () => {
    setConfirmDialogOpen(false);
    if (actionType === "delete") {
      await handleDeleteStudent(actionStudentId);
    } else if (actionType === "edit") {
      setEditDialogOpen(true);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        {t('studentManagement.title')}
      </Typography>

      {/* Search Field */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('studentManagement.searchPlaceholder')}
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
              <TableCell>{t('studentManagement.table.name')}</TableCell>
              <TableCell>{t('studentManagement.table.email')}</TableCell>
              <TableCell>{t('studentManagement.table.phone')}</TableCell>
              <TableCell>{t('studentManagement.table.birthDate')}</TableCell>
              <TableCell>{t('studentManagement.table.status')}</TableCell>
              <TableCell>{t('studentManagement.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.birthDate}</TableCell>
                <TableCell>
                  <Chip 
                    label={student.isActive ? t('common.status.active') : t('common.status.inactive')} 
                    color={student.isActive ? "success" : "error"} 
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(student)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmAction("delete", student.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                  <Switch
                    checked={student.isActive}
                    onChange={() => handleToggleStatus(student)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>{t('studentManagement.edit.title')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('studentManagement.form.fullName')}
            value={selectedStudent?.fullName || ""}
            onChange={(e) => setSelectedStudent({ ...selectedStudent, fullName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('studentManagement.form.email')}
            value={selectedStudent?.email || ""}
            onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('studentManagement.form.phone')}
            value={selectedStudent?.phone || ""}
            onChange={(e) => setSelectedStudent({ ...selectedStudent, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('studentManagement.form.birthDate')}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={selectedStudent?.birthDate || ""}
            onChange={(e) => setSelectedStudent({ ...selectedStudent, birthDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>{t('common.actions.cancel')}</Button>
          <Button onClick={handleEditSave} color="primary">{t('common.actions.save')}</Button>
        </DialogActions>
      </Dialog>

      {/* New Student Dialog */}
      <Dialog open={newStudentDialogOpen} onClose={() => setNewStudentDialogOpen(false)}>
        <DialogTitle>{t('studentManagement.create.title')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('studentManagement.form.fullName')}
            value={newStudent.fullName}
            onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('studentManagement.form.email')}
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('studentManagement.form.phone')}
            value={newStudent.phone}
            onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('studentManagement.form.birthDate')}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newStudent.birthDate}
            onChange={(e) => setNewStudent({ ...newStudent, birthDate: e.target.value })}
          />
          <TextField
            fullWidth
            label={t('studentManagement.form.password')}
            type="password"
            value={newStudent.password}
            onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
            sx={{ mb: 2, mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewStudentDialogOpen(false)}>{t('common.actions.cancel')}</Button>
          <Button onClick={handleNewStudentSave} color="primary">{t('common.actions.create')}</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>{t('common.confirm.title')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('common.confirm.message', { action: t(`common.actions.${actionType}`) })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>{t('common.actions.cancel')}</Button>
          <Button onClick={handleConfirmedAction} color="primary">{t('common.actions.confirm')}</Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Adding Student */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleNewStudentClick}
      >
        <AddIcon />
      </Fab>

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