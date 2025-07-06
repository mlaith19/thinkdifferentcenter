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

const paymentMethods = [
  "cash",
  "check",
  "bank_transfer",
  "credit_card",
  "debit_card",
  "mobile_payment",
];

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    paymentMethod: "",
    paymentDate: new Date(),
    notes: "",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/accountant/payment-tracking", {
        params: {
          instituteId: user.instituteId,
          branchId: user.branchId,
        },
      });
      setPayments(response.data.data.payments || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        studentId: payment.studentId,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        paymentDate: new Date(payment.paymentDate),
        notes: payment.notes || "",
      });
    } else {
      setEditingPayment(null);
      setFormData({
        studentId: "",
        amount: "",
        paymentMethod: "",
        paymentDate: new Date(),
        notes: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPayment(null);
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
      const paymentData = {
        ...formData,
        instituteId: user.instituteId,
        branchId: user.branchId,
      };

      if (editingPayment) {
        await api.put(`/accountant/payments/${editingPayment.id}`, paymentData);
      } else {
        await api.post("/accountant/payments", paymentData);
      }

      handleCloseDialog();
      fetchPayments();
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const handleDelete = async (paymentId) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await api.delete(`/accountant/payments/${paymentId}`);
        fetchPayments();
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.studentName?.toLowerCase().includes(searchLower) ||
      payment.amount.toString().includes(searchLower) ||
      payment.paymentMethod.toLowerCase().includes(searchLower)
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
              <Typography variant="h4">Payments Management</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Record New Payment
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  label="Search Payments"
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
                      <TableCell>Student</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.studentName}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={payment.paymentMethod.replace("_", " ")}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{payment.notes}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(payment)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(payment.id)}
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
            {editingPayment ? "Edit Payment" : "Record New Payment"}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Student ID"
                    name="studentId"
                    value={formData.studentId}
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Payment Method"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                  >
                    {paymentMethods.map((method) => (
                      <MenuItem key={method} value={method}>
                        {method.replace("_", " ")}
                      </MenuItem>
                    ))}
                  </TextField>
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
              {editingPayment ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default PaymentsManagement; 