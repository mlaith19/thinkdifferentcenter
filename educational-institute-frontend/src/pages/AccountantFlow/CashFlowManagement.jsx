import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";
import Navbar from "../../components/Navbar";

const CashFlowManagement = () => {
  const [cashFlow, setCashFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  useEffect(() => {
    fetchCashFlow();
  }, [selectedDate, selectedPeriod]);

  const fetchCashFlow = async () => {
    try {
      setLoading(true);
      const response = await api.get("/accountant/monthly-cash-flow", {
        params: {
          instituteId: user.instituteId,
          branchId: user.branchId,
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
      });
      setCashFlow(response.data.data);
    } catch (error) {
      console.error("Error fetching cash flow:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    handleMenuClose();
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
  };

  const renderCashFlowChart = () => {
    if (!cashFlow) return null;

    const data = [
      {
        name: "Cash In",
        amount: cashFlow.cashIn,
      },
      {
        name: "Check In",
        amount: cashFlow.checkIn,
      },
      {
        name: "Bank Transfer In",
        amount: cashFlow.bankTransferIn,
      },
      {
        name: "Cash Out",
        amount: cashFlow.cashOut,
      },
      {
        name: "Check Out",
        amount: cashFlow.checkOut,
      },
      {
        name: "Bank Transfer Out",
        amount: cashFlow.bankTransferOut,
      },
    ];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

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
              <Typography variant="h4">Cash Flow Management</Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  label="Select Month"
                  type="month"
                  value={selectedDate.toISOString().slice(0, 7)}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <IconButton onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handlePeriodChange("month")}>Monthly View</MenuItem>
                  <MenuItem onClick={() => handlePeriodChange("quarter")}>Quarterly View</MenuItem>
                  <MenuItem onClick={() => handlePeriodChange("year")}>Yearly View</MenuItem>
                </Menu>
              </Box>
            </Box>
          </Grid>

          {/* Cash Flow Overview Cards */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Total Inflow"
                avatar={<TrendingUpIcon color="success" />}
              />
              <CardContent>
                <Typography variant="h4" color="success.main">
                  ${cashFlow?.totalIn?.toFixed(2) || "0.00"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Total Outflow"
                avatar={<TrendingDownIcon color="error" />}
              />
              <CardContent>
                <Typography variant="h4" color="error.main">
                  ${cashFlow?.totalOut?.toFixed(2) || "0.00"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Net Flow" />
              <CardContent>
                <Typography
                  variant="h4"
                  color={cashFlow?.netFlow >= 0 ? "success.main" : "error.main"}
                >
                  ${cashFlow?.netFlow?.toFixed(2) || "0.00"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Cash Flow Details */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Cash Inflow Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Cash In:</Typography>
                    <Typography>${cashFlow?.cashIn?.toFixed(2) || "0.00"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Check In:</Typography>
                    <Typography>${cashFlow?.checkIn?.toFixed(2) || "0.00"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Bank Transfer In:</Typography>
                    <Typography>${cashFlow?.bankTransferIn?.toFixed(2) || "0.00"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="subtitle1">Total Inflow:</Typography>
                    <Typography variant="subtitle1" color="success.main">
                      ${cashFlow?.totalIn?.toFixed(2) || "0.00"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Cash Outflow Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Cash Out:</Typography>
                    <Typography>${cashFlow?.cashOut?.toFixed(2) || "0.00"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Check Out:</Typography>
                    <Typography>${cashFlow?.checkOut?.toFixed(2) || "0.00"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Bank Transfer Out:</Typography>
                    <Typography>${cashFlow?.bankTransferOut?.toFixed(2) || "0.00"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="subtitle1">Total Outflow:</Typography>
                    <Typography variant="subtitle1" color="error.main">
                      ${cashFlow?.totalOut?.toFixed(2) || "0.00"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Cash Flow Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Cash Flow Trend</Typography>
              {renderCashFlowChart()}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CashFlowManagement; 