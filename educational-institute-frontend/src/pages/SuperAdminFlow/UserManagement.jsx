import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Grid, // Added Grid for better layout
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const InstitutionUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    instituteId: "",
    branchId: "",
  });
  const [error, setError] = useState("");

  // Fetch users from the API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/institute");
      setUsers(response.data.data);
    } catch (error) {
      setError("Failed to fetch users.");
      console.error("Error fetching users:", error);
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
      await axios.put(`http://localhost:5000/api/users/${selectedUser.id}`, selectedUser);
      fetchUsers();
      setEditDialogOpen(false);
    } catch (error) {
      setError("Failed to update user.");
      console.error("Error updating user:", error);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      setError("Failed to delete user.");
      console.error("Error deleting user:", error);
    }
  };

  // Toggle user status
  const handleToggleStatus = async (user) => {
    try {
      const updatedUser = { ...user, isActive: !user.isActive };
      await axios.put(`http://localhost:5000/api/users/${user.id}`, updatedUser);
      fetchUsers();
    } catch (error) {
      setError("Failed to update user status.");
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
      await axios.post("http://localhost:5000/api/users", newUser);
      fetchUsers();
      setNewUserDialogOpen(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "",
        instituteId: "",
        branchId: "",
      });
    } catch (error) {
      setError("Failed to create user.");
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
                  <Switch
                    checked={user.isActive}
                    onChange={() => handleToggleStatus(user)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
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
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, username: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={selectedUser?.email || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup
              value={selectedUser?.role || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
            >
              <FormControlLabel value="super_admin" control={<Radio />} label="Super Admin" />
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
            {/* Username */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel component="legend">Role</FormLabel>
                <RadioGroup
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <FormControlLabel value="super_admin" control={<Radio />} label="Super Admin" />
                  <FormControlLabel value="institute_admin" control={<Radio />} label="Institute Admin" />
                  <FormControlLabel value="secretary" control={<Radio />} label="Secretary" />
                  <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                  <FormControlLabel value="student" control={<Radio />} label="Student" />
                  <FormControlLabel value="accountant" control={<Radio />} label="Accountant" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Institute ID */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Institute ID"
                type="number"
                value={newUser.instituteId}
                onChange={(e) => setNewUser({ ...newUser, instituteId: e.target.value })}
              />
            </Grid>

            {/* Branch ID */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Branch ID"
                type="number"
                value={newUser.branchId}
                onChange={(e) => setNewUser({ ...newUser, branchId: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewUserDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewUserSave} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Adding User */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleNewUserClick}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default InstitutionUsers;