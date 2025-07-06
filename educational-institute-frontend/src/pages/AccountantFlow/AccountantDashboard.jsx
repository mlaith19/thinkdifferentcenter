import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  MoreVert as MoreVertIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  LocalAtm as CashIcon,
  AccountBalance as BankIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";
import Navbar from "../../components/Navbar";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AccountantDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  useEffect(() => {
    fetchFinancialData();
  }, [selectedPeriod]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      const endDate = new Date();

      if (selectedPeriod === "month") {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (selectedPeriod === "quarter") {
        startDate.setMonth(startDate.getMonth() - 3);
      } else if (selectedPeriod === "year") {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const response = await api.get("/accountant/financial-reports", {
        params: {
          instituteId: user.instituteId,
          branchId: user.branchId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      setFinancialData(response.data.data);
    } catch (error) {
      console.error("Error fetching financial data:", error);
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

  const renderPaymentMethodsChart = () => {
    if (!financialData?.paymentMethods) return null;

    const data = Object.entries(financialData.paymentMethods).map(([method, amount]) => ({
      name: method.charAt(0).toUpperCase() + method.slice(1),
      value: amount,
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderRevenueExpenseChart = () => {
    if (!financialData) return null;

    const data = [
      {
        name: "Revenue",
        amount: financialData.totalRevenue,
      },
      {
        name: "Expenses",
        amount: financialData.totalExpenses,
      },
      {
        name: "Net Profit",
        amount: financialData.netProfit,
      },
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
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
          {/* Header */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h4">Financial Dashboard</Typography>
              <Box>
                <IconButton onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handlePeriodChange("month")}>Last Month</MenuItem>
                  <MenuItem onClick={() => handlePeriodChange("quarter")}>Last Quarter</MenuItem>
                  <MenuItem onClick={() => handlePeriodChange("year")}>Last Year</MenuItem>
                </Menu>
              </Box>
            </Box>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<MoneyIcon />}
                    onClick={() => navigate("/accountant/payments")}
                  >
                    Record Payment
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<ReceiptIcon />}
                    onClick={() => navigate("/accountant/expenses")}
                  >
                    Add Expense
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<CashIcon />}
                    onClick={() => navigate("/accountant/cash-flow")}
                  >
                    Cash Flow
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<BankIcon />}
                    onClick={() => navigate("/accountant/reports")}
                  >
                    Generate Report
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Financial Overview Cards */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Total Revenue" />
              <CardContent>
                <Typography variant="h4" color="primary">
                  ${financialData?.totalRevenue?.toFixed(2) || "0.00"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Total Expenses" />
              <CardContent>
                <Typography variant="h4" color="error">
                  ${financialData?.totalExpenses?.toFixed(2) || "0.00"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Net Profit" />
              <CardContent>
                <Typography
                  variant="h4"
                  color={financialData?.netProfit >= 0 ? "success.main" : "error.main"}
                >
                  ${financialData?.netProfit?.toFixed(2) || "0.00"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Payment Methods Distribution</Typography>
              {renderPaymentMethodsChart()}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Revenue vs Expenses</Typography>
              {renderRevenueExpenseChart()}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AccountantDashboard;