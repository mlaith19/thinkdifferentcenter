import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, FormControl, InputLabel, 
  Select, MenuItem, CircularProgress 
} from "@mui/material";
import api from "../../services/api";

const TeacherReplacementForm = ({ open, onClose, originalTeacher, session }) => {
  const [replacementTeacher, setReplacementTeacher] = useState("");
  const [reason, setReason] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAvailableTeachers();
    }
  }, [open]);

  const fetchAvailableTeachers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/teachers/available", {
        params: {
          instituteId: session?.instituteId,
          date: session?.date,
          time: session?.startTime
        }
      });
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post("/teacher/replace", {
        originalTeacherId: originalTeacher.id,
        replacementTeacherId: replacementTeacher,
        sessionId: session.id,
        reason
      });
      onClose();
    } catch (error) {
      console.error("Error replacing teacher:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Request Teacher Replacement</DialogTitle>
      <DialogContent>
        <TextField
          label="Original Teacher"
          value={originalTeacher.name}
          fullWidth
          margin="normal"
          disabled
        />
        
        <TextField
          label="Course"
          value={session?.courseName || ''}
          fullWidth
          margin="normal"
          disabled
        />
        
        <TextField
          label="Session Date & Time"
          value={`${session?.date} ${session?.startTime}-${session?.endTime}`}
          fullWidth
          margin="normal"
          disabled
        />

        {loading ? (
          <CircularProgress />
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel>Replacement Teacher</InputLabel>
            <Select
              value={replacementTeacher}
              onChange={(e) => setReplacementTeacher(e.target.value)}
              label="Replacement Teacher"
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          label="Reason for Replacement"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary"
          disabled={!replacementTeacher || !reason}
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeacherReplacementForm;