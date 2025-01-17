import React, { useState, useEffect } from "react";
import api from "../services/api";
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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const UserManagement = () => {
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
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/all");
      setUsers(response.data.data);
    } catch (error) {
      setError("Failed to fetch users.");
      console.error("Error fetching users:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/users/update/${selectedUser.id}`, selectedUser);
      fetchUsers();
      setEditDialogOpen(false);
    } catch (error) {
      setError("Failed to update user.");
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/delete/${userId}`);
      fetchUsers();
    } catch (error) {
      setError("Failed to delete user.");
      console.error("Error deleting user:", error);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const updatedUser = { ...user, isActive: !user.isActive };
      await api.put(`/users/update/${user.id}`, updatedUser);
      fetchUsers();
    } catch (error) {
      setError("Failed to update user status.");
      console.error("Error updating user status:", error);
    }
  };

  const handleNewUserClick = () => {
    setNewUserDialogOpen(true);
  };

  const handleNewUserSave = async () => {
    try {
      await api.post("/users/create", newUser);
      fetchUsers();
      setNewUserDialogOpen(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (error) {
      setError("Failed to create user.");
      console.error("Error creating user:", error);
    }
  };

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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        User Management
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
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
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
          <TextField
            fullWidth
            label="Role"
            value={selectedUser?.role || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, role: e.target.value })
            }
            sx={{ mb: 2 }}
          />
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
          <TextField
            fullWidth
            label="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            sx={{ mb: 2 }}
          />
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

export default UserManagement;