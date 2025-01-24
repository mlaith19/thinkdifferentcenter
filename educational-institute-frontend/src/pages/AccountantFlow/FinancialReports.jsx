import React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const FinancialReports = () => {
  const financialData = [
    { id: 1, month: "January", revenue: 10000, expenses: 6000, profit: 4000 },
    { id: 2, month: "February", revenue: 12000, expenses: 7000, profit: 5000 },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Financial Reports
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Month</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Revenue</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Expenses</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {financialData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>{data.month}</TableCell>
                  <TableCell>${data.revenue}</TableCell>
                  <TableCell>${data.expenses}</TableCell>
                  <TableCell>${data.profit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FinancialReports;