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
  Autocomplete,
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

const discountTypes = [
  "percentage",
  "fixed",
  "scholarship",
];

const statusOptions = ["active", "expired", "cancelled"];

const DiscountsManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    amount: "",
    percentage: "",
    type: "",
    reason: "",
    startDate: new Date(),
    endDate: null,
    status: "active",
    notes: "",
  });

  useEffect(() => {
    fetchDiscounts();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/accountant/discounts", {
        params: {
          instituteId: user.instituteId,
          branchId: user.branchId,
        },
      });
      setDiscounts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/users", {
        params: {
          role: "student",
          instituteId: user.instituteId,
          branchId: user.branchId,
        },
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses", {
        params: {
          instituteId: user.instituteId,
          branchId: user.branchId,
        },
      });
      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleOpenDialog = (discount = null) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        studentId: discount.studentId,
        courseId: discount.courseId,
        amount: discount.amount,
        percentage: discount.percentage,
        type: discount.type,
        reason: discount.reason,
        startDate: new Date(discount.startDate),
        endDate: discount.endDate ? new Date(discount.endDate) : null,
        status: discount.status,
        notes: discount.notes || "",
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        studentId: "",
        courseId: "",
        amount: "",
        percentage: "",
        type: "",
        reason: "",
        startDate: new Date(),
        endDate: null,
        status: "active",
        notes: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDiscount(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const discountData = {
        ...formData,
        instituteId: user.instituteId,
        branchId: user.branchId,
        approvedBy: user.id,
        approvedAt: new Date(),
      };

      if (editingDiscount) {
        await api.put(`/accountant/discounts/${editingDiscount.id}`, discountData);
      } else {
        await api.post("/accountant/discounts", discountData);
      }

      handleCloseDialog();
      fetchDiscounts();
    } catch (error) {
      console.error("Error saving discount:", error);
    }
  };

  const handleDelete = async (discountId) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      try {
        await api.delete(`/accountant/discounts/${discountId}`);
        fetchDiscounts();
      } catch (error) {
        console.error("Error deleting discount:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "expired":
        return "error";
      case "cancelled":
        return "warning";
      default:
        return "default";
    }
  };

  const filteredDiscounts = discounts.filter((discount) => {
    const searchLower = searchTerm.toLowerCase();
    const student = students.find((s) => s.id === discount.studentId);
    const course = courses.find((c) => c.id === discount.courseId);
    return (
      student?.name?.toLowerCase().includes(searchLower) ||
      course?.name?.toLowerCase().includes(searchLower) ||
      discount.type.toLowerCase().includes(searchLower) ||
      discount.reason.toLowerCase().includes(searchLower)
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
              <Typography variant="h4">Discounts Management</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add New Discount
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  label="Search Discounts"
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
                      <TableCell>Course</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Amount/Percentage</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDiscounts.map((discount) => {
                      const student = students.find((s) => s.id === discount.studentId);
                      const course = courses.find((c) => c.id === discount.courseId);
                      return (
                        <TableRow key={discount.id}>
                          <TableCell>{student?.name}</TableCell>
                          <TableCell>{course?.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={discount.type}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {discount.type === "percentage"
                              ? `${discount.percentage}%`
                              : `$${discount.amount}`}
                          </TableCell>
                          <TableCell>
                            {new Date(discount.startDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {discount.endDate
                              ? new Date(discount.endDate).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={discount.status}
                              size="small"
                              color={getStatusColor(discount.status)}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(discount)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(discount.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingDiscount ? "Edit Discount" : "Add New Discount"}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={students}
                    getOptionLabel={(option) => option.name}
                    value={students.find((s) => s.id === formData.studentId) || null}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        studentId: newValue?.id || "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Student"
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={courses}
                    getOptionLabel={(option) => option.name}
                    value={courses.find((c) => c.id === formData.courseId) || null}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        courseId: newValue?.id || "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Course"
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Discount Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      label="Discount Type"
                      required
                    >
                      {discountTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {formData.type === "percentage" ? (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Percentage"
                      name="percentage"
                      type="number"
                      value={formData.percentage}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        endAdornment: <Typography>%</Typography>,
                      }}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: <Typography>$</Typography>,
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason"
                    name="reason"
                    multiline
                    rows={2}
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleDateChange(e, "startDate")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="End Date (Optional)"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => handleDateChange(e, "endDate")}
                    InputLabelProps={{
                      shrink: true,
                    }}
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
              {editingDiscount ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DiscountsManagement; 