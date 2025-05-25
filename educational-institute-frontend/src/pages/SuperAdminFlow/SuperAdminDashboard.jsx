import React, { useState, useEffect } from "react";
import api from "../../services/api";
import FloatingActionButton from "../../components/FloatingActionButton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  Grid,
  Paper,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import Navbar from "../../components/Navbar"; // Navbar component
import AddIcon from "@mui/icons-material/Add"; // Import the AddIcon
import LanguageSwitcher from "../../components/LanguageSwitcher";

const SuperAdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInstituteId, setSelectedInstituteId] = useState(null);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const response = await api.get("/institute");
      console.log(response.data.toString());
      setInstitutes(response.data.data);
    } catch (error) {
      setError(`Failed to fetch institutes.`);
      console.error("Error fetching institutes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (instituteId) => {
    const id = Number(instituteId);
    const selectedInstitute = institutes.find((institute) => institute.id === id);
    if (!selectedInstitute) {
      console.error("Institute not found for ID:", instituteId);
      return;
    }
    console.log("Selected Institute:", selectedInstitute.id);
    navigate("/InstituteManagement", { state: { institute: selectedInstitute } });
  };

  const handleDeleteClick = (instituteId) => {
    setSelectedInstituteId(instituteId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/institute/${selectedInstituteId}`);
      setInstitutes(institutes.filter((institute) => institute.id !== selectedInstituteId));
      setSnackbarMessage("Institute deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setError("Failed to delete institute. Please try again.");
      setSnackbarMessage("Failed to delete institute. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedInstituteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedInstituteId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar /> {/* Navbar is always displayed */}

      <Box sx={{ p: 4 }}>
     

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress /> {/* Loader displayed in the center */}
          </Box>
        ) : error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
            flexDirection="column"
          >
            <ErrorIcon style={{ fontSize: 60, color: "red" }} />
            <Typography variant="h6" color="textSecondary">
              {error}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
              Institutes
            </Typography>

            {institutes.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="50vh"
                flexDirection="column"
              >
                <ErrorIcon style={{ fontSize: 60, color: "gray" }} />
                <Typography variant="h6" color="textSecondary">
                  {t('superAdmin.dashboard.noInstitutes')}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {institutes.map((institute) => (
                  <Grid item key={institute.id} xs={12} sm={6} lg={4}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                      {/* Institute Image */}
                      <Box
                        sx={{
                          height: 150,
                          backgroundImage: `url(/university.png)`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          position: "relative",
                        }}
                      >
                        <Avatar
                          sx={{
                            position: "absolute",
                            bottom: -24,
                            left: 16,
                            width: 56,
                            height: 56,
                            border: "3px solid white",
                            bgcolor: "primary.main",
                          }}
                        >
                          {institute.name.charAt(0)}
                        </Avatar>
                      </Box>

                      <CardContent sx={{ mt: 4 }}>
                        {/* Institute Name and Email */}
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                          {institute.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {institute.email}
                        </Typography>

                        {/* Subscription Period */}
                        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "background.paper" }}>
                          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <DateRangeIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                              {t('superAdmin.dashboard.subscriptionPeriod')}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {t('superAdmin.dashboard.startDate')}: {institute.startDate}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('superAdmin.dashboard.endDate')}: {institute.endDate}
                          </Typography>
                        </Paper>

                        {/* Admin Details */}
                        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "background.paper" }}>
                          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                              {t('superAdmin.dashboard.admin')}
                            </Typography>
                          </Box>
                          {institute.admin ? (
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {institute.admin.fullName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {institute.admin.email}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {t('superAdmin.dashboard.noAdmin')}
                            </Typography>
                          )}
                        </Paper>

                        {/* Branches */}
                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.paper" }}>
                          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                              {t('superAdmin.dashboard.branches')}
                            </Typography>
                          </Box>
                          {institute.branches.map((branch) => (
                            <Box key={branch.id} sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {branch.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {branch.address || t('superAdmin.dashboard.noAddress')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {branch.phone || t('superAdmin.dashboard.noPhone')}
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                            </Box>
                          ))}
                        </Paper>
                      </CardContent>

                      {/* Edit and Delete Actions */}
                      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(institute.id)}
                          color="primary"
                        >
                          {t('superAdmin.dashboard.edit')}
                        </Button>
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(institute.id)}
                          color="error"
                        >
                          {t('superAdmin.dashboard.delete')}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Floating Action Button */}
        <FloatingActionButton
          onClick={() => {
            // Navigate to the "/institutes/create" route
            navigate("/institutes/create");
          }}
          icon={<AddIcon />} // Use the appropriate icon
          label="Add Institute" // Customize the label
        />
      </Box>

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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{t('superAdmin.dashboard.confirmDelete')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t('superAdmin.dashboard.deleteConfirmation')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            {t('superAdmin.dashboard.cancel')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            {t('superAdmin.dashboard.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminDashboard;