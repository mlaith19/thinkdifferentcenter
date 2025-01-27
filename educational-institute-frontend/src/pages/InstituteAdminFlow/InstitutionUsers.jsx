import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
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
  Switch,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fab,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";

const InstitutionUsers = () => {
  const location = useLocation();
  const instituteId = location.state?.instituteId;

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "", branchId: "" });
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionUserId, setActionUserId] = useState(null);

  // Fetch users and branches on component mount
  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/institute", {
        params: { instituteId },
      });
      setUsers(response.data.data);
    } catch (error) {
      setSnackbarMessage("Failed to fetch users.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch branches from the API
  const fetchBranches = async () => {
    try {
      const response = await api.get("/institute/branch", {
        params: { instituteId },
      });
      setBranches(response.data.data);
    } catch (error) {
      setSnackbarMessage("Failed to fetch branches. Cannot create users.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error fetching branches:", error);
    }
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Open edit dialog for a user
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  // Save edited user details
  const handleEditSave = async () => {
    try {
      await api.put(`/users/${selectedUser.id}`, selectedUser);
      fetchUsers();
      setEditDialogOpen(false);
      setSnackbarMessage("User updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to update user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating user:", error);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
      setSnackbarMessage("User deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error deleting user:", error);
    }
  };

  // Toggle user status
  const handleToggleStatus = async (user) => {
    try {
      const updatedUser = { ...user, isActive: !user.isActive };
      await api.put(`/users/${user.id}`, updatedUser);
      fetchUsers();
    } catch (error) {
      setSnackbarMessage("Failed to update user status.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating user status:", error);
    }
  };

  // Open new user dialog
  const handleNewUserClick = () => {
    setNewUserDialogOpen(true);
  };

  // Save new user
  const handleNewUserSave = async () => {
    try {
      await api.post("/users", { ...newUser, instituteId });
      fetchUsers();
      setNewUserDialogOpen(false);
      setNewUser({ username: "", email: "", password: "", role: "", branchId: "" });
      setSnackbarMessage("User created successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to create user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error creating user:", error);
    }
  };

  // Get role color for chip
  const getRoleColor = (role) => {
    switch (role) {
      case "super_admin":
        return "primary";
      case "institute_admin":
        return "secondary";
      case "secretary":
        return "success";
      case "teacher":
        return "warning";
      case "student":
        return "error";
      case "accountant":
        return "info";
      default:
        return "default";
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Open confirmation dialog
  const handleConfirmAction = (type, userId) => {
    setActionType(type);
    setActionUserId(userId);
    setConfirmDialogOpen(true);
  };

  // Handle confirmed action
  const handleConfirmedAction = async () => {
    setConfirmDialogOpen(false);
    if (actionType === "delete") {
      await handleDeleteUser(actionUserId);
    } else if (actionType === "edit") {
      setEditDialogOpen(true);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Institution Users
      </Typography>

      {/* Search Field */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
          }}
        />
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={user.role} color={getRoleColor(user.role)} size="small" />
                </TableCell>
                <TableCell>
                  <Switch checked={user.isActive} onChange={() => handleToggleStatus(user)} color="primary" />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleConfirmAction("edit", user.id)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmAction("delete", user.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={selectedUser?.username || ""}
            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={selectedUser?.email || ""}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup
              value={selectedUser?.role || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
            >
              <FormControlLabel value="institute_admin" control={<Radio />} label="Institute Admin" />
              <FormControlLabel value="secretary" control={<Radio />} label="Secretary" />
              <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
              <FormControlLabel value="student" control={<Radio />} label="Student" />
              <FormControlLabel value="accountant" control={<Radio />} label="Accountant" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* New User Dialog */}
      <Dialog open={newUserDialogOpen} onClose={() => setNewUserDialogOpen(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel component="legend">Role</FormLabel>
                <RadioGroup
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <FormControlLabel value="institute_admin" control={<Radio />} label="Institute Admin" />
                  <FormControlLabel value="secretary" control={<Radio />} label="Secretary" />
                  <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                  <FormControlLabel value="student" control={<Radio />} label="Student" />
                  <FormControlLabel value="accountant" control={<Radio />} label="Accountant" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={newUser.branchId}
                  onChange={(e) => setNewUser({ ...newUser, branchId: e.target.value })}
                  label="Branch"
                  disabled={branches.length === 0}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewUserDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewUserSave} color="primary" disabled={branches.length === 0}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to {actionType} this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmedAction} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Adding User */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleNewUserClick}
        disabled={branches.length === 0}
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

export default InstitutionUsers;