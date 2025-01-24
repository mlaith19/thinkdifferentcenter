import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const PaymentSlip = () => {
  // Dummy data for payment slips
  const payments = [
    { id: 1, amount: "$200", date: "2023-10-01", method: "Cash" },
    { id: 2, amount: "$150", date: "2023-10-15", method: "Bank Transfer" },
    { id: 3, amount: "$100", date: "2023-10-30", method: "Visa" },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Payment Slips
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment Method</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PaymentSlip;