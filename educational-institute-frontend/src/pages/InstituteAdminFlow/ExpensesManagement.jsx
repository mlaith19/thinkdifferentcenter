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

const ExpensesManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({
    id: "",
    vendor: "",
    paymentDate: "",
    amount: "",
    paymentMethod: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const handleOpenDialog = (expense = null) => {
    setCurrentExpense(expense || { id: "", vendor: "", paymentDate: "", amount: "", paymentMethod: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveExpense = async () => {
    try {
      if (currentExpense.id) {
        await api.put(`/expenses/${currentExpense.id}`, currentExpense);
      } else {
        await api.post("/expenses", currentExpense);
      }
      fetchExpenses();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save expense:", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Expenses Management
      </Typography>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
        Add Expense
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.vendor}</TableCell>
                <TableCell>{expense.paymentDate}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.paymentMethod}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(expense)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteExpense(expense.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentExpense.id ? "Edit Expense" : "Add Expense"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Vendor"
            value={currentExpense.vendor}
            onChange={(e) => setCurrentExpense({ ...currentExpense, vendor: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Payment Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentExpense.paymentDate}
            onChange={(e) => setCurrentExpense({ ...currentExpense, paymentDate: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Amount"
            value={currentExpense.amount}
            onChange={(e) => setCurrentExpense({ ...currentExpense, amount: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={currentExpense.paymentMethod}
              onChange={(e) => setCurrentExpense({ ...currentExpense, paymentMethod: e.target.value })}
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
          <Button onClick={handleSaveExpense} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesManagement;