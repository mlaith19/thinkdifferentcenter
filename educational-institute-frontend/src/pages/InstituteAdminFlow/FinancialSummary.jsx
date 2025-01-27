import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const FinancialSummary = () => {
  const financialData = {
    totalRevenue: 100000,
    totalExpenses: 60000,
    netProfit: 40000,
  };

  const revenueData = [
    { name: "Jan", revenue: 20000 },
    { name: "Feb", revenue: 25000 },
    { name: "Mar", revenue: 30000 },
    { name: "Apr", revenue: 22000 },
    { name: "May", revenue: 28000 },
    { name: "Jun", revenue: 35000 },
  ];

  const expenseData = [
    { name: "Rent", value: 15000 },
    { name: "Salaries", value: 25000 },
    { name: "Utilities", value: 5000 },
    { name: "Supplies", value: 10000 },
    { name: "Misc", value: 5000 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  const recentTransactions = [
    { id: 1, description: "Office Supplies", amount: 500, date: "2023-10-01" },
    { id: 2, description: "Client Payment", amount: 20000, date: "2023-10-05" },
    { id: 3, description: "Utility Bill", amount: 1500, date: "2023-10-10" },
    { id: 4, description: "Marketing", amount: 3000, date: "2023-10-15" },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Financial Summary
      </Typography>

      {/* Financial Overview Cards */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AttachMoneyIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h4">${financialData.totalRevenue}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingDownIcon sx={{ fontSize: 40, color: "error.main", mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Total Expenses
                </Typography>
              </Box>
              <Typography variant="h4">${financialData.totalExpenses}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon sx={{ fontSize: 40, color: "success.main", mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Net Profit
                </Typography>
              </Box>
              <Typography variant="h4">${financialData.netProfit}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Monthly Revenue
            </Typography>
            <BarChart width={500} height={300} data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Expense Breakdown
            </Typography>
            <PieChart width={500} height={300}>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions Table */}
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Recent Transactions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount ($)</TableCell>
                <TableCell align="right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right">{transaction.amount}</TableCell>
                  <TableCell align="right">{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FinancialSummary;