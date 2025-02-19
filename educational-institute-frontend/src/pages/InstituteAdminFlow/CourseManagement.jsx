import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FloatingActionButton from "../../components/FloatingActionButton";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../../utils/decodeToken";
import api from "../../services/api";

const CourseManagement = () => {
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [registrationStartDate, setRegistrationStartDate] = useState("");
  const [registrationEndDate, setRegistrationEndDate] = useState("");
  const [fromAge, setFromAge] = useState("");
  const [toAge, setToAge] = useState("");
  const [priceType, setPriceType] = useState("full_course"); // Default value
  const [price, setPrice] = useState("");
  const [numberOfSessions, setNumberOfSessions] = useState(0);
  const [scheduleDays, setScheduleDays] = useState([]);
  const [autoGenerateSchedule, setAutoGenerateSchedule] = useState(true);
  const [status, setStatus] = useState("active");
  const [sessionDates, setSessionDates] = useState([]);
  const [newSessionDate, setNewSessionDate] = useState("");
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [teachers, setTeachers] = useState([]);
const [selectedTeacherId, setSelectedTeacherId] = useState("");
const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const navigate = useNavigate();

  // Decode token to get user information
  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const instituteId = user?.instituteId;

  // Fetch courses on component mount
  useEffect(() => {
    if (instituteId) {
      fetchCourses();
      fetchTeachers();
    }
  }, [instituteId]);
  const fetchTeachers = async () => {
    try {
        const response = await api.get(`/institute/${instituteId}/teachers`);
        setTeachers(response.data.data);
    } catch (error) {
        setSnackbarMessage("Failed to fetch teachers.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Error fetching teachers:", error);
    }
};
  // Fetch courses from the API
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/courses", { params: { instituteId } });
      setCourses(response.data);
    } catch (error) {
      setSnackbarMessage("Failed to fetch courses.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog open/close
  const handleClickOpen = () => {
    console.log("Create Course button clicked!");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setCourseName("");
    setDescription("");
    setRegistrationStartDate("");
    setRegistrationEndDate("");
    setFromAge("");
    setToAge("");
    setPriceType("full_course"); // Reset to default
    setPrice("");
    setNumberOfSessions(0);
    setScheduleDays([]);
    setAutoGenerateSchedule(true);
    setStatus("active");
    setSessionDates([]);
    setNewSessionDate("");
    setNewSessionTitle("");  setSelectedTeacherId("");
  };

  // Handle saving a new course
  const handleSave = async () => {
    if (!user?.branchId) {
      setSnackbarMessage("Branch ID is missing.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Validate required fields
    if (!courseName || !registrationStartDate || !registrationEndDate|| !selectedTeacherId|| !selectedTeacherName) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const newCourse = {
        name: courseName,
        description,
        paymentType: priceType,
        price: priceType === "free" ? 0 : price,
        registrationStartDate,
        registrationEndDate,
        minAge: fromAge,
        maxAge: toAge,
        numberOfSessions,
        scheduleDays: JSON.stringify(scheduleDays), // Save as JSON string
        autoGenerateSchedule,
        status,
        sessionDates: sessionDates.map((session) => ({
          date: session.date,
          title: session.title,
        })),
        instituteId,
        branchId: user.branchId, teacherId: selectedTeacherId, 
        teacherName: selectedTeacherName
      };
      
      await api.post("/courses/create", newCourse);
      fetchCourses();
      setSnackbarMessage("Course created successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      setSnackbarMessage("Failed to create course.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error creating course:", error);
    }
  };

  // Handle adding a session date
  const handleAddSessionDate = () => {
    if (!newSessionDate || !newSessionTitle) return;
    const date = new Date(newSessionDate);
    const startDate = new Date(registrationStartDate);
    const endDate = new Date(registrationEndDate);

    if (date < startDate || date > endDate) {
      setSnackbarMessage("Session date must be between registration start and end dates.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setSessionDates([...sessionDates, { date: newSessionDate, title: newSessionTitle }]);
    setNewSessionDate("");
    setNewSessionTitle("");
  };

  // Handle removing a session date
  const handleRemoveSessionDate = (date) => {
    setSessionDates(sessionDates.filter((session) => session.date !== date));
  };

  // Handle search input
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle viewing details
  const handleViewDetails = (courseId) =>
    navigate(`/course-manage-details/${courseId}`);

  // Handle deleting a course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      fetchCourses();
      setSnackbarMessage("Course deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete course.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error deleting course:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Course Management
      </Typography>

      {/* Search Field */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
          }}
        />
      </Box>

      {/* Courses Table */}
      {loading ? (
        <CircularProgress />
      ) : filteredCourses.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
          No courses found for this institute.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Instructor</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Price Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>
  {new Date(course.registrationStartDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
</TableCell>
<TableCell>
  {new Date(course.registrationEndDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
</TableCell>

                  <TableCell>{course.paymentType}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleViewDetails(course.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteCourse(course.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Floating Action Button for Adding Course */}
      <FloatingActionButton onClick={handleClickOpen} label="Add Course" icon={<AddIcon />} />

      {/* Dialog for Adding Course */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Registration Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={registrationStartDate}
                onChange={(e) => setRegistrationStartDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Registration End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={registrationEndDate}
                onChange={(e) => setRegistrationEndDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="From Age"
                type="number"
                value={fromAge}
                onChange={(e) => setFromAge(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="To Age"
                type="number"
                value={toAge}
                onChange={(e) => setToAge(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Price Type</FormLabel>
                <RadioGroup
                  row
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value)}
                >
                  <FormControlLabel value="free" control={<Radio />} label="Free" />
                  <FormControlLabel value="per_session" control={<Radio />} label="Per Session" />
                  <FormControlLabel value="full_course" control={<Radio />} label="Entire Course" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {priceType !== "free" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Number of Sessions"
                type="number"
                value={numberOfSessions}
                onChange={(e) => setNumberOfSessions(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Schedule Days</InputLabel>
                <Select
                  multiple
                  value={scheduleDays}
                  onChange={(e) => setScheduleDays(e.target.value)}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                    <MenuItem key={day} value={day}>
                      <Checkbox checked={scheduleDays.includes(day)} />
                      <ListItemText primary={day} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autoGenerateSchedule}
                    onChange={(e) => setAutoGenerateSchedule(e.target.checked)}
                  />
                }
                label="Auto-Generate Schedule"
              />
            </Grid>
            <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Teacher</InputLabel>
                                <Select
                                    value={selectedTeacherId}
                                    onChange={(e) => {
                                      const selectedTeacher = teachers.find(teacher => teacher.id === e.target.value);
                                      setSelectedTeacherId(e.target.value);
                                      setSelectedTeacherName(selectedTeacher ? selectedTeacher.fullName : "");
                                    }}
                                    label="Select Teacher"
                                    required
                                >
                                    {teachers.map((teacher) => (
                                        <MenuItem key={teacher.id} value={teacher.id}>
                                            {teacher.fullName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Session Dates</Typography>
              <TextField
                fullWidth
                label="Session Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newSessionDate}
                onChange={(e) => setNewSessionDate(e.target.value)}
              />
              <TextField
                fullWidth
                label="Session Title"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                sx={{ mt: 2 }}
              />
              <Button onClick={handleAddSessionDate} color="primary" sx={{ mt: 2 }}>
                Add Session
              </Button>
              <List>
                {sessionDates.map((session) => (
                  <ListItem key={session.date}>
                    <ListItemText primary={`${session.date} - ${session.title}`} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleRemoveSessionDate(session.date)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
     
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseManagement;