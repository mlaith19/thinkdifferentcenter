import React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const PointsRewards = () => {
  const points = [
    { id: 1, activity: "Homework", points: 10 },
    { id: 2, activity: "Participation", points: 5 },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Points & Rewards
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Activity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {points.map((point) => (
                <TableRow key={point.id}>
                  <TableCell>{point.activity}</TableCell>
                  <TableCell>{point.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PointsRewards;