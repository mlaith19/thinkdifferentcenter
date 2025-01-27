import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import api from "../../services/api";

const InstituteManagement = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState(state?.institute || null);
  const [loading, setLoading] = useState(!state?.institute);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteBranchDialogOpen, setDeleteBranchDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  const [name, setName] = useState(institute?.name || "");
  const [email, setEmail] = useState(institute?.email || "");
  const [startDate, setStartDate] = useState(institute?.startDate || "");
  const [endDate, setEndDate] = useState(institute?.endDate || "");
  const [adminName, setAdminName] = useState(institute?.admin?.fullName || "");
  const [adminEmail, setAdminEmail] = useState(institute?.admin?.email || "");
  const [branches, setBranches] = useState(institute?.branches || []);
  const [status, setStatus] = useState(institute?.status || "active");

  useEffect(() => {
    if (!institute && id) {
      fetchInstitute();
    }
  }, [id, institute]);

  const fetchInstitute = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/institute/${id}`);
      const instituteData = response.data.data;
      setInstitute(instituteData);
      setName(instituteData.name);
      setEmail(instituteData.email);
      setStartDate(instituteData.startDate);
      setEndDate(instituteData.endDate);
      setAdminName(instituteData.admin.fullName);
      setAdminEmail(instituteData.admin.email);
      setBranches(instituteData.branches);
      setStatus(instituteData.status);
    } catch (error) {
      setError("Failed to fetch institute data.");
      console.error("Error fetching institute:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedInstitute = {
        name,
        email,
        startDate,
        endDate,
        admin: {
          fullName: adminName,
          email: adminEmail,
        },
        branches,
        status,
      };

      await api.put(`/institute/${id}`, updatedInstitute);
      setSnackbarMessage("Institute updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to update institute.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating institute:", error);
    }
  };

  const handleDeleteInstitute = async () => {
    try {
      await api.delete(`/institute/${id}`);
      setSnackbarMessage("Institute deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/institutes");
    } catch (error) {
      setSnackbarMessage("Failed to delete institute.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error deleting institute:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleAddBranch = () => {
    const newBranch = {
      id: branches.length + 1,
      name: "",
      address: "",
      phone: "",
      users: [],
    };
    setBranches([...branches, newBranch]);
  };

  const handleDeleteBranch = async (branchId) => {
    try {
      await api.delete(`/institute/${id}/branch/${branchId}`);
      setBranches(branches.filter((branch) => branch.id !== branchId));
      setSnackbarMessage("Branch deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete branch.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error deleting branch:", error);
    } finally {
      setDeleteBranchDialogOpen(false);
    }
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.checked ? "active" : "blocked");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "institute_admin":
        return "primary";
      case "secretary":
        return "secondary";
      case "teacher":
        return "success";
      case "student":
        return "warning";
      case "accountant":
        return "error";
      default:
        return "default";
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!institute && !id) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          No institute data found.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Manage Institute
      </Typography>

      {/* Status Switch */}
      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={
            <Switch
              checked={status === "active"}
              onChange={handleStatusChange}
              color="primary"
            />
          }
          label={status === "active" ? "Active" : "Blocked"}
        />
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Institute Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Institute Details
            </Typography>
            <TextField
              fullWidth
              label="Institute Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
            />
          </Grid>

          {/* Admin Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Admin Details
            </Typography>
            <TextField
              fullWidth
              label="Admin Name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Admin Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
          </Grid>

          {/* Branches */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Branches
            </Typography>
            {branches.map((branch, index) => (
              <Paper key={branch.id} elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Branch {index + 1}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setBranchToDelete(branch.id);
                      setDeleteBranchDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  label="Branch Name"
                  value={branch.name}
                  onChange={(e) => {
                    const updatedBranches = [...branches];
                    updatedBranches[index].name = e.target.value;
                    setBranches(updatedBranches);
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Address"
                  value={branch.address}
                  onChange={(e) => {
                    const updatedBranches = [...branches];
                    updatedBranches[index].address = e.target.value;
                    setBranches(updatedBranches);
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={branch.phone}
                  onChange={(e) => {
                    const updatedBranches = [...branches];
                    updatedBranches[index].phone = e.target.value;
                    setBranches(updatedBranches);
                  }}
                  sx={{ mb: 2 }}
                />

                {/* Users Section */}
                <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>
                  Users
                </Typography>
                <List>
                  {branch.users?.map((user) => (
                    <ListItem key={user.id}>
                      <Avatar sx={{ bgcolor: getRoleColor(user.role), mr: 2 }}>
                        {user.fullName.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={user.fullName}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            <Chip
                              label={user.role}
                              color={getRoleColor(user.role)}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </Grid>
        </Grid>

        {/* Save and Cancel Buttons */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => navigate("/institutes")}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>

      {/* Floating Action Button for Adding Branch */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleAddBranch}
      >
        <AddIcon />
      </Fab>

      {/* Floating Action Button for Navigating to InstitutionUsers */}
      <Fab
        color="secondary"
        aria-label="users"
        sx={{ position: "fixed", bottom: 80, right: 16 }}
        onClick={() => navigate(`/institution-users `, { state: { instituteId: institute.id } })}
      >
        <PeopleIcon />
      </Fab>

      {/* Delete Institution Button */}
      <Fab
        color="error"
        aria-label="delete"
        sx={{ position: "fixed", bottom: 144, right: 16 }}
        onClick={() => setDeleteDialogOpen(true)}
      >
        <DeleteIcon />
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

      {/* Delete Institute Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Institute</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this institute? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteInstitute} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Branch Confirmation Dialog */}
      <Dialog
        open={deleteBranchDialogOpen}
        onClose={() => setDeleteBranchDialogOpen(false)}
      >
        <DialogTitle>Delete Branch</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this branch? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteBranchDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDeleteBranch(branchToDelete)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstituteManagement;