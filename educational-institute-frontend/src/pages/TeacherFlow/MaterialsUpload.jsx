import React, { useState } from "react";
import { Box, Typography, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";

const MaterialsUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Materials Upload
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
        >
          Upload Materials
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileUpload}
          />
        </Button>

        <List sx={{ mt: 2 }}>
          {files.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MaterialsUpload;