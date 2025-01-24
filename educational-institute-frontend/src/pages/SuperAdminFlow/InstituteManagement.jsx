import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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
} from "@mui/material";
import {
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const InstituteManagement = () => {
  const { state } = useLocation();
  const institute = state?.institute;

  const [name, setName] = useState(institute?.name || "");
  const [email, setEmail] = useState(institute?.email || "");
  const [startDate, setStartDate] = useState(institute?.startDate || "");
  const [endDate, setEndDate] = useState(institute?.endDate || "");
  const [adminName, setAdminName] = useState(institute?.admin?.fullName || "");
  const [adminEmail, setAdminEmail] = useState(institute?.admin?.email || "");
  const [branches, setBranches] = useState(
   [
      {
        id: 1,
        name: "Main Branch",
        address: "123 Main St, City",
        phone: "123-456-7890",
        users: [
          {
            id: 1,
            fullName: "John Doe",
            role: "institute_admin",
            email: "john.doe@example.com",
          },
          {
            id: 2,
            fullName: "Jane Smith",
            role: "secretary",
            email: "jane.smith@example.com",
          },
          {
            id: 3,
            fullName: "Alice Johnson",
            role: "teacher",
            email: "alice.johnson@example.com",
          },
        ],
      },
      {
        id: 2,
        name: "Second Branch",
        address: "456 Elm St, City",
        phone: "987-654-3210",
        users: [
          {
            id: 4,
            fullName: "Bob Brown",
            role: "student",
            email: "bob.brown@example.com",
          },
          {
            id: 5,
            fullName: "Charlie Davis",
            role: "accountant",
            email: "charlie.davis@example.com",
          },
        ],
      },
    ]
  );
  const [status, setStatus] = useState(institute?.status || "active");

  if (!institute) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          No institute data found.
        </Typography>
      </Box>
    );
  }

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

  const handleDeleteBranch = (branchId) => {
    setBranches(branches.filter((branch) => branch.id !== branchId));
  };

  const handleDeleteInstitute = () => {
    console.log("Delete institute:", institute.id);
    // Add delete logic here
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
                    onClick={() => handleDeleteBranch(branch.id)}
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
            onClick={() => console.log("Cancel clicked")}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => console.log("Save clicked")}
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

      {/* Delete Institution Button */}
      <Fab
        color="error"
        aria-label="delete"
        sx={{ position: "fixed", bottom: 80, right: 16 }}
        onClick={handleDeleteInstitute}
      >
        <DeleteIcon />
      </Fab>
    </Box>
  );
};

export default InstituteManagement;