import React, { useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FloatingActionButton from "../components/FloatingActionButton";

const CourseManagement = () => {
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // Save course logic here
    handleClose();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Course Management
      </Typography>

      <FloatingActionButton onClick={handleClickOpen}    label="Add Course"  icon={<AddIcon />} />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Course Name"
            fullWidth
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Course Description"
            fullWidth
            multiline
            rows={4}
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseManagement;