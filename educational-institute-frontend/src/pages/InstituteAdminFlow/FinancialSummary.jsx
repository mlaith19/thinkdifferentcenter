import React from "react";
import { Box, Typography, Paper, Grid, Card, CardContent } from "@mui/material";
import { AttachMoney as AttachMoneyIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from "@mui/icons-material";

const FinancialSummary = () => {
  const financialData = {
    totalRevenue: 100000,
    totalExpenses: 60000,
    netProfit: 40000,
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Financial Summary
      </Typography>

      <Grid container spacing={4}>
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
    </Box>
  );
};

export default FinancialSummary;