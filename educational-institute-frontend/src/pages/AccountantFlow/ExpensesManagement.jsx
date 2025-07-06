import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";
import Navbar from "../../components/Navbar";

const expenseCategories = [
  "rent",
  "utilities",
  "salaries",
  "supplies",
  "equipment",
  "maintenance",
  "marketing",
  "other",
];

const paymentMethods = [
  "cash",
  "check",
  "bank_transfer",
  "credit_card",
  "debit_card",
];

const statusOptions = ["pending", "approved", "rejected"];

const ExpensesManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  const [formData, setFormData] = useState({
    vendor: "",
    amount: "",
    paymentMethod: "",
    paymentDate: new Date(),
    category: "",
    description: "",
    receiptNumber: "",
    status: "pending",
    notes: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/accountant/expenses", {
        params: {
          instituteId: user.instituteId,
          branchId: user.branchId,
        },
      });
      setExpenses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        vendor: expense.vendor,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod,
        paymentDate: new Date(expense.paymentDate),
        category: expense.category,
        description: expense.description,
        receiptNumber: expense.receiptNumber,
        status: expense.status,
        notes: expense.notes || "",
      });
    } else {
      setEditingExpense(null);
      setFormData({
        vendor: "",
        amount: "",
        paymentMethod: "",
        paymentDate: new Date(),
        category: "",
        description: "",
        receiptNumber: "",
        status: "pending",
        notes: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExpense(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      paymentDate: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...formData,
        instituteId: user.instituteId,
        branchId: user.branchId,
        recordedBy: user.id,
      };

      if (editingExpense) {
        await api.put(`/accountant/expenses/${editingExpense.id}`, expenseData);
      } else {
        await api.post("/accountant/expenses", expenseData);
      }

      handleCloseDialog();
      fetchExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await api.delete(`/accountant/expenses/${expenseId}`);
        fetchExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      expense.vendor?.toLowerCase().includes(searchLower) ||
      expense.amount.toString().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower) ||
      expense.description?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h4">Expenses Management</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add New Expense
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  label="Search Expenses"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                  sx={{ flexGrow: 1 }}
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.vendor}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={expense.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={expense.paymentMethod.replace("_", " ")}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(expense.paymentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={expense.status}
                            size="small"
                            color={getStatusColor(expense.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(expense)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingExpense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Vendor"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      label="Category"
                      required
                    >
                      {expenseCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      label="Payment Method"
                      required
                    >
                      {paymentMethods.map((method) => (
                        <MenuItem key={method} value={method}>
                          {method.replace("_", " ")}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Payment Date"
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Receipt Number"
                    name="receiptNumber"
                    value={formData.receiptNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={2}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      label="Status"
                      required
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingExpense ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ExpensesManagement; 