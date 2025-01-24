import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../../services/api";

const NotificationsManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentNotification, setCurrentNotification] = useState({
    id: "",
    message: "",
    recipient: "",
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleOpenDialog = (notification = null) => {
    setCurrentNotification(notification || { id: "", message: "", recipient: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveNotification = async () => {
    try {
      if (currentNotification.id) {
        await api.put(`/notifications/${currentNotification.id}`, currentNotification);
      } else {
        await api.post("/notifications", currentNotification);
      }
      fetchNotifications();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save notification:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Notifications Management
      </Typography>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
        Add Notification
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Message</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.message}</TableCell>
                <TableCell>{notification.recipient}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(notification)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteNotification(notification.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentNotification.id ? "Edit Notification" : "Add Notification"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Message"
            value={currentNotification.message}
            onChange={(e) => setCurrentNotification({ ...currentNotification, message: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Recipient"
            value={currentNotification.recipient}
            onChange={(e) => setCurrentNotification({ ...currentNotification, recipient: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveNotification} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsManagement;