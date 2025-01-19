import React, { useState } from "react";
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
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FloatingActionButton from "../components/FloatingActionButton";
import { useNavigate } from "react-router-dom";

// Dummy data for courses
const dummyCourses = [
  {
    id: 1,
    name: "Mathematics 101",
    startDate: "2023-10-01",
    endDate: "2023-12-15",
    instructor: "Dr. Smith",
    fromAge: 15,
    toAge: 18,
    registrationStartDate: "2023-09-01",
    registrationEndDate: "2023-09-30",
    priceType: "entire",
    price: 200,
  },
  {
    id: 2,
    name: "Physics 101",
    startDate: "2023-11-01",
    endDate: "2024-01-15",
    instructor: "Dr. Johnson",
    fromAge: 16,
    toAge: 19,
    registrationStartDate: "2023-10-01",
    registrationEndDate: "2023-10-31",
    priceType: "session",
    price: 20,
  },
  {
    id: 3,
    name: "Chemistry 101",
    startDate: "2024-01-10",
    endDate: "2024-04-20",
    instructor: "Dr. Brown",
    fromAge: 14,
    toAge: 17,
    registrationStartDate: "2023-12-01",
    registrationEndDate: "2023-12-31",
    priceType: "free",
    price: 0,
  },
];

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
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // Save course logic here
    console.log({
      courseName,
      startDate,
      endDate,
      instructor,
      fromAge,
      toAge,
      registrationStartDate,
      registrationEndDate,
      priceType,
      price,
    });
    handleClose();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = dummyCourses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (courseId) => {
    navigate(`/course-manage-details/${courseId}`);
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
                <TableCell>{course.startDate}</TableCell>
                <TableCell>{course.endDate}</TableCell>
                <TableCell>{course.priceType}</TableCell>
                <TableCell>{course.price}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleViewDetails(course.id)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructor"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
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
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Course Price Type</FormLabel>
                <RadioGroup
                  row
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value)}
                >
                  <FormControlLabel value="entire" control={<Radio />} label="The price of the entire course" />
                  <FormControlLabel value="session" control={<Radio />} label="Price per session" />
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
    </Box>
  );
};

export default CourseManagement;