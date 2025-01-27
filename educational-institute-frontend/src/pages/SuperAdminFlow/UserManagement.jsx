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
  Grid,
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionUser, setActionUser] = useState(null);

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

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

  const handleDeleteUser = async (userId) => {
    setActionType('delete');
    setActionUser(userId);
    setConfirmDialogOpen(true);
  };

  const handleToggleStatus = async (user) => {
    setActionType('toggle');
    setActionUser(user);
    setConfirmDialogOpen(true);
  };

  const handleNewUserClick = () => {
    setNewUserDialogOpen(true);
  };

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

  const filteredUsers = users.filter(
    (user) =>
      user.email !== "super@admin.com" &&
      (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Institution Users
      </Typography>

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
                  <FormControlLabel value="super_admin" control={<Radio />} label="Super Admin" />
                  <FormControlLabel value="institute_admin" control={<Radio />} label="Institute Admin" />
                  <FormControlLabel value="secretary" control={<Radio />} label="Secretary" />
                  <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                  <FormControlLabel value="student" control={<Radio />} label="Student" />
                  <FormControlLabel value="accountant" control={<Radio />} label="Accountant" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Institute ID"
                type="number"
                value={newUser.instituteId}
                onChange={(e) => setNewUser({ ...newUser, instituteId: e.target.value })}
              />
            </Grid>
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

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType === 'delete' ? 'delete' : 'toggle the status of'} this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={async () => {
            if (actionType === 'delete') {
              try {
                await axios.delete(`http://localhost:5000/api/users/${actionUser}`);
                fetchUsers();
              } catch (error) {
                setError("Failed to delete user.");
                console.error("Error deleting user:", error);
              }
            } else if (actionType === 'toggle') {
              try {
                const updatedUser = { ...actionUser, isActive: !actionUser.isActive };
                await axios.put(`http://localhost:5000/api/users/${actionUser.id}`, updatedUser);
                fetchUsers();
              } catch (error) {
                setError("Failed to update user status.");
                console.error("Error updating user status:", error);
              }
            }
            setConfirmDialogOpen(false);
          }} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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