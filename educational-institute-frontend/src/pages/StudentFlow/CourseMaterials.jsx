import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

const CourseMaterials = () => {
  const materials = [
    { id: 1, name: "Lecture 1 - Introduction", type: "PDF" },
    { id: 2, name: "Lecture 2 - Algebra", type: "PDF" },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Course Materials
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <List>
          {materials.map((material) => (
            <ListItem key={material.id}>
              <ListItemText primary={material.name} secondary={material.type} />
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
              >
                Download
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CourseMaterials;