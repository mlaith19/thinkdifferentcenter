import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Accordion,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
  Snackbar,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  ListItemSecondaryAction,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";

const InstituteAdminDashboard = () => {
  const [loadingInstitute, setLoadingInstitute] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingFinancialReports, setLoadingFinancialReports] = useState(true);
  const [error, setError] = useState("");
  const [institute, setInstitute] = useState(null);
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [financialReports, setFinancialReports] = useState([]);
  const [newStudentDialogOpen, setNewStudentDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
  });
   const navigate = useNavigate();
 ///create a new course
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
     const [loading, setLoading] = useState(false);
 
    const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const token = localStorage.getItem("token");
  const user = decodeToken(token);
    const instituteId = user?.instituteId;
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
    // Handle removing a session date
    const handleRemoveSessionDate = (date) => {
      setSessionDates(sessionDates.filter((session) => session.date !== date));
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
  

  ///create a new student
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleNewStudentClick = () => {
    setNewStudentDialogOpen(true);
  };

  const handleNewStudentSave = async () => {
    try {
      const emailParts = newStudent.email.split(/[.@]/);
      const generatedUsername = emailParts[0];
      await api.post("/users/create", {
        ...newStudent,
        instituteId: user.instituteId,
        username: generatedUsername,
        role: "student",
      });
      setNewStudentDialogOpen(false);
      setNewStudent({
        fullName: "",
        email: "",
        phone: "",
        birthDate: "",
        password: "",
      });
      setSnackbarMessage("Student created successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to create student.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error creating student:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  // Decode token to get user information


  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.instituteId) return;
      try {
        await Promise.all([
          fetchInstitute(),
          fetchBranches(),
          fetchCourses(),
          fetchFinancialReports(),
          fetchTeachers()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    fetchData(); // Invoke fetchData only once
  }, []); // Empty array ensures it runs once when the component mounts
  
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
  const fetchInstitute = async () => {
    try {
      const response = await api.get(`/institute/${user.instituteId}`);
      console.log(response.data.data);
      setInstitute(response.data.data);
    } catch (error) {
      setError("Failed to fetch institute data.");
      console.error("Error fetching institute:", error);
    } finally {
      setLoadingInstitute(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await api.get(`/institute/${user.instituteId}/branches`);
      console.log(response.data.branches);
      setBranches(response.data.branches);
    } catch (error) {
      setError("Failed to fetch branches data.");
      console.error("Error fetching branches:", error);
    } finally {
      setLoadingBranches(false);
    }
  };

  const fetchCourses = async () => {
    setLoadingCourses(true); // Start loading
    try {
        const response = await api.get("/courses", { params: { instituteId } });
        setCourses(response.data || []); // Set courses
    } catch (error) {
        setSnackbarMessage("Failed to fetch courses.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Error fetching courses:", error);
    } finally {
        setLoadingCourses(false); // Ensure loading state is false
    }
};


  const fetchFinancialReports = async () => {
    try {
      const response = await api.get(
        `/institute/${user.instituteId}/financial-reports`
      );
      console.log(response.data.data);
      setFinancialReports(response.data.data);
    } catch (error) {
      setError("Failed to fetch financial reports data.");
      console.error("Error fetching financial reports:", error);
    } finally {
      setLoadingFinancialReports(false);
    }
  };

  if (!user || !user.instituteId) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          No institute data found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{ width: 80, height: 80, bgcolor: "primary.main", mb: 2 }}
                >
                  <SchoolIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {institute?.name || "Institute Name"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin
                </Typography>
              </Box>
              <List>
              <ListItem button onClick={() => navigate("/students")}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Students"  />
                </ListItem>
                <ListItem button onClick={() => navigate("/courses")}>
                  <ListItemIcon>
                    <ClassIcon />
                  </ListItemIcon>
                  <ListItemText primary="Classes" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Assignments" />
                </ListItem>
                <Divider sx={{ my: 2 }} />
                <ListItem button>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Main Dashboard */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {/* Quick Actions */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<PeopleIcon />}
                      onClick={handleNewStudentClick}
                    >
                      Add Student
                    </Button>
                    <Button variant="contained" startIcon={<ClassIcon />}  onClick={handleClickOpen} >
                      Create Course
                    </Button>
                    <Button variant="contained" startIcon={<AssignmentIcon />}>
                      Assign Task
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* Branches Accordion */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Branches
                  </Typography>
                  {loadingBranches ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100px",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : branches.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No branches found.
                    </Typography>
                  ) : (
                    branches.map((branch) => (
                      <Accordion key={branch.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>{branch.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <strong>Address:</strong> {branch.address}
                          </Typography>
                          <Typography>
                            <strong>Phone:</strong> {branch.phone}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  )}
                </Paper>
              </Grid>

              {/* Courses */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Courses
                  </Typography>
                  {loadingCourses ? (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100px" }}>
        <CircularProgress />
    </Box>
) : !courses ||courses.length === 0 ? (
    <Typography variant="body2" color="text.secondary">No courses found.</Typography>
) : (
    <List>
        {Array.isArray(courses) && courses.map((course) => (
            <ListItem key={course.id}>
                <ListItemText primary={course.name} secondary={`${course.paymentType} - $${course.price}`} />
            </ListItem>
        ))}
    </List>
)}
                </Paper>
              </Grid>

              {/* Financial Reports */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Financial Reports
                  </Typography>
                  {loadingFinancialReports ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100px",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : financialReports.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No financial reports found.
                    </Typography>
                  ) : (
                    <List>
                      {financialReports.map((report) => (
                        <ListItem key={report.id}>
                          <ListItemText
                            primary={`${report.period} Report`}
                            secondary={`Revenue: $${report.totalRevenue}, Profit: $${report.netProfit}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={newStudentDialogOpen}
        onClose={() => setNewStudentDialogOpen(false)}
      >
        <DialogTitle>Create New Student</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            value={newStudent.fullName}
            onChange={(e) =>
              setNewStudent({ ...newStudent, fullName: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, email: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Phone"
            value={newStudent.phone}
            onChange={(e) =>
              setNewStudent({ ...newStudent, phone: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Birth Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newStudent.birthDate}
            onChange={(e) =>
              setNewStudent({ ...newStudent, birthDate: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newStudent.password}
            onChange={(e) =>
              setNewStudent({ ...newStudent, password: e.target.value })
            }
            sx={{ mb: 2, mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewStudentDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleNewStudentSave} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InstituteAdminDashboard;
