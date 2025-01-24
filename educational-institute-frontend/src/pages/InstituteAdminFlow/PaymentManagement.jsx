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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../../services/api";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({
    id: "",
    studentId: "",
    amount: "",
    date: "",
    paymentMethod: "",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/payments");
      setPayments(response.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

  const handleOpenDialog = (payment = null) => {
    setCurrentPayment(payment || { id: "", studentId: "", amount: "", date: "", paymentMethod: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSavePayment = async () => {
    try {
      if (currentPayment.id) {
        await api.put(`/payments/${currentPayment.id}`, currentPayment);
      } else {
        await api.post("/payments", currentPayment);
      }
      fetchPayments();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save payment:", error);
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      await api.delete(`/payments/${id}`);
      fetchPayments();
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Payment Management
      </Typography>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
        Add Payment
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.studentId}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(payment)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeletePayment(payment.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentPayment.id ? "Edit Payment" : "Add Payment"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Student ID"
            value={currentPayment.studentId}
            onChange={(e) => setCurrentPayment({ ...currentPayment, studentId: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Amount"
            value={currentPayment.amount}
            onChange={(e) => setCurrentPayment({ ...currentPayment, amount: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentPayment.date}
            onChange={(e) => setCurrentPayment({ ...currentPayment, date: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={currentPayment.paymentMethod}
              onChange={(e) => setCurrentPayment({ ...currentPayment, paymentMethod: e.target.value })}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Check">Check</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="Visa">Visa</MenuItem>
              <MenuItem value="BIT">BIT</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSavePayment} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentManagement;