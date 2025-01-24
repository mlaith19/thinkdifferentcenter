import React, { useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([
    { id: 1, studentName: "John Doe", amount: 200, status: "Paid" },
    { id: 2, studentName: "Jane Smith", amount: 150, status: "Pending" },
  ]);

  const handleAddInvoice = () => {
    setInvoices([...invoices, { id: invoices.length + 1, studentName: "New Student", amount: 100, status: "Pending" }]);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Invoice Management
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddInvoice}
          >
            Add Invoice
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.studentName}</TableCell>
                  <TableCell>${invoice.amount}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default InvoiceManagement;