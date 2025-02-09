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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructor, setInstructor] = useState("");
  const [fromAge, setFromAge] = useState("");
  const [toAge, setToAge] = useState("");
  const [registrationStartDate, setRegistrationStartDate] = useState("");
  const [registrationEndDate, setRegistrationEndDate] = useState("");
  const [priceType, setPriceType] = useState("entire");
  const [price, setPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  // Decode token to get user information
  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const instituteId = user?.instituteId;

  // Fetch courses on component mount
  useEffect(() => {
    if (instituteId) {
      fetchCourses();
    }
  }, [instituteId]);

  // Fetch courses from the API
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/courses", {
        params: { instituteId },
      });
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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle save new course
  const handleSave = async () => {
    try {
      const newCourse = {
        name: courseName,
        paymentType: priceType,
        price: priceType === "free" ? 0 : price,
        registrationStartDate,
        registrationEndDate,
        minAge: fromAge,
        maxAge: toAge,
        instituteId,
        branchId: user.branchId,
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

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle view details
  const handleViewDetails = (courseId) => {
    navigate(`/course-manage-details/${courseId}`);
  };

  // Handle delete course
  const handleDeleteCourse = async (courseId) => {
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

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
                  <TableCell>{course.registrationStartDate}</TableCell>
                  <TableCell>{course.registrationEndDate}</TableCell>
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

      {/* Dialog for Creating a New Course */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={registrationStartDate}
                onChange={(e) => setRegistrationStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={registrationEndDate}
                onChange={(e) => setRegistrationEndDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="From Age"
                type="number"
                value={fromAge}
                onChange={(e) => setFromAge(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                <FormLabel component="legend">Course Price Type</FormLabel>
                <RadioGroup
                  row
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value)}
                >
                  <FormControlLabel value="entire" control={<Radio />} label="The price of the entire course" />
                  <FormControlLabel value="per_session" control={<Radio />} label="Price per session" />
                  <FormControlLabel value="free" control={<Radio />} label="Free" />
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
                />
              </Grid>
            )}
          </Grid>
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

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseManagement;