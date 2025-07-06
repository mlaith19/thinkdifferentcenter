import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";
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
  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const { state } = location;
  const instituteId = state?.instituteId;

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'teacher',
    branchId: '',
    birthDate: '',
    phone: ''
  });
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionUserId, setActionUserId] = useState(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        params: { instituteId: user.instituteId || instituteId },
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
      const instituteId = user.instituteId || state?.instituteId;
      const response = await api.get(`/institute/${instituteId}/branches`);
      setBranches(response.data.data || []);
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
      await api.delete(`/users/delete/${userId}`);
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

  // Function to generate username from full name
  const generateUsername = (fullName) => {
    if (!fullName) return '';
    // Convert to lowercase and remove special characters
    const cleanName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Take first 3 characters of first name and first 3 of last name
    const nameParts = cleanName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].slice(0, 3)}${nameParts[nameParts.length - 1].slice(0, 3)}`;
    }
    // If only one name, use first 6 characters
    return cleanName.slice(0, 6);
  };

  // Handle full name change
  const handleFullNameChange = (e) => {
    const fullName = e.target.value;
    setNewUser(prev => ({
      ...prev,
      fullName,
      username: generateUsername(fullName)
    }));
  };

  // Save new user
  const handleNewUserSave = async () => {
    try {
      setLoading(true);
      const userData = {
        ...newUser,
        username: generateUsername(newUser.fullName), // Ensure username is generated
        role: newUser.role || 'teacher',
        branchId: newUser.branchId || branches[0]?.id,
        instituteId: user.instituteId || instituteId
      };

      await api.post("/users/create", userData);
      fetchUsers();
      setNewUserDialogOpen(false);
      setNewUser({
        email: '',
        password: '',
        fullName: '',
        role: 'teacher',
        branchId: '',
        birthDate: '',
        phone: ''
      });
      setSnackbarMessage("User created successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      let errorMessage = 'Failed to create user';
      
      if (error.response?.data) {
        const { message: errorMsg, errorDetails } = error.response.data;
        
        if (errorMsg === "Email already exists.") {
          errorMessage = "This email address is already registered. Please use a different email.";
        } else if (errorMsg === "You do not have permission to create users.") {
          errorMessage = "You don't have permission to create users. Please contact your administrator.";
        } else if (errorDetails) {
          const fieldErrors = Object.entries(errorDetails).map(([field, details]) => {
            const fieldName = field.replace(/_/g, ' ').replace(/\d+$/, '');
            return `${fieldName}: ${details.message}`;
          });
          errorMessage = fieldErrors.join('\n');
        } else if (errorMsg) {
          errorMessage = errorMsg;
        }
      }

      setErrorMessage(errorMessage);
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={user.role} color={getRoleColor(user.role)} size="small" />
                </TableCell>
                <TableCell>
                  <Switch checked={user.isActive} onChange={() => handleToggleStatus(user)} color="primary" />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() =>  handleEditClick(user)} color="primary">
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
            label="Full Name"
            value={selectedUser?.fullName || ""}
            onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={selectedUser?.email || ""}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Role</FormLabel>
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Branch</InputLabel>
            <Select
              value={selectedUser?.branchId || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, branchId: e.target.value })}
              label="Branch"
            >
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* New User Dialog */}
      <Dialog open={newUserDialogOpen} onClose={() => setNewUserDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={newUser.fullName}
                onChange={handleFullNameChange}
                required
             
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birth Date"
                type="date"
                value={newUser.birthDate}
                onChange={(e) => setNewUser({ ...newUser, birthDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={newUser.branchId}
                  onChange={(e) => setNewUser({ ...newUser, branchId: e.target.value })}
                  label="Branch"
                  disabled={branches.length === 0}
                  required
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
          <Button 
            onClick={handleNewUserSave} 
            color="primary" 
            disabled={branches.length === 0 || loading || !newUser.fullName}
          >
            {loading ? <CircularProgress size={24} /> : 'Create'}
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

      {/* Error Dialog */}
      <Dialog 
        open={errorDialogOpen} 
        onClose={() => setErrorDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>Error Creating User</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Please fix the following issues:
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-line',
              color: 'error.main'
            }}
          >
            {errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstitutionUsers;