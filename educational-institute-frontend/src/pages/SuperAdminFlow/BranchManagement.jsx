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

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBranch, setCurrentBranch] = useState({ id: "", name: "", address: "", phone: "" });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await api.get("/branches");
      setBranches(response.data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const handleOpenDialog = (branch = null) => {
    setCurrentBranch(branch || { id: "", name: "", address: "", phone: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveBranch = async () => {
    try {
      if (currentBranch.id) {
        await api.put(`/branches/${currentBranch.id}`, currentBranch);
      } else {
        await api.post("/branches", currentBranch);
      }
      fetchBranches();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save branch:", error);
    }
  };

  const handleDeleteBranch = async (id) => {
    try {
      await api.delete(`/branches/${id}`);
      fetchBranches();
    } catch (error) {
      console.error("Failed to delete branch:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Branch Management
      </Typography>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
        Add Branch
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.address}</TableCell>
                <TableCell>{branch.phone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(branch)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteBranch(branch.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentBranch.id ? "Edit Branch" : "Add Branch"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={currentBranch.name}
            onChange={(e) => setCurrentBranch({ ...currentBranch, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            value={currentBranch.address}
            onChange={(e) => setCurrentBranch({ ...currentBranch, address: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Phone"
            value={currentBranch.phone}
            onChange={(e) => setCurrentBranch({ ...currentBranch, phone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveBranch} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BranchManagement;