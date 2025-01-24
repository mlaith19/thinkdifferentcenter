import React, { useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([
    { id: 1, code: "DISCOUNT10", percentage: 10 },
    { id: 2, code: "DISCOUNT20", percentage: 20 },
  ]);

  const [newDiscount, setNewDiscount] = useState({ code: "", percentage: "" });

  const handleAddDiscount = () => {
    setDiscounts([...discounts, { id: discounts.length + 1, ...newDiscount }]);
    setNewDiscount({ code: "", percentage: "" });
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Discount Management
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Discount Code"
            value={newDiscount.code}
            onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Percentage"
            value={newDiscount.percentage}
            onChange={(e) => setNewDiscount({ ...newDiscount, percentage: e.target.value })}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDiscount}
          >
            Add Discount
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>{discount.code}</TableCell>
                  <TableCell>{discount.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DiscountManagement;