import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";
import Navbar from "../../components/Navbar";

const AvailableCourses = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [availableCourses, setAvailableCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetailsDialog, setCourseDetailsDialog] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const studentId = user?.userId;
  const instituteId = user?.instituteId;

  useEffect(() => {
    fetchAvailableCourses();
  }, [instituteId]);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, availableCourses]);

  const fetchAvailableCourses = async () => {
    setLoading(true);
    setError("");
    try {
      // First get all courses for the institute
      const response = await api.get(`/courses/institute/${instituteId}`);
      const allCourses = response.data.data || [];

      // Then get enrolled courses
      const enrolledResponse = await api.get(`/student/${studentId}/courses`);
      const enrolledCourses = enrolledResponse.data.data || [];
      const enrolledCourseIds = enrolledCourses.map(course => course.id);

      // Filter out enrolled courses
      const available = allCourses.filter(course => !enrolledCourseIds.includes(course.id));
      setAvailableCourses(available);
      setFilteredCourses(available);
    } catch (error) {
      setError("Failed to fetch available courses");
      console.error("Error fetching available courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    if (!searchQuery.trim()) {
      setFilteredCourses(availableCourses);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = availableCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.teacher?.name.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCourseDetailsDialog(true);
  };

  const handleEnroll = async (courseId) => {
    try {
      setLoading(true);
      const response = await api.post('/courses/join', { 
        courseId,
        studentId 
      });

      if (response.data.succeed) {
        setSuccessMessage("Successfully enrolled in the course!");
        // Remove the enrolled course from the list
        setAvailableCourses(prev => prev.filter(course => course.id !== courseId));
        setFilteredCourses(prev => prev.filter(course => course.id !== courseId));
        // Close the dialog
        setSelectedCourse(null);
        setCourseDetailsDialog(false);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to enroll in course");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setCourseDetailsDialog(false);
    setSelectedCourse(null);
    setEnrollSuccess(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            fontWeight: "bold", 
            color: "primary.main",
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          Available Courses
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search courses by name, description, or teacher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={3}>
          {filteredCourses.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                {searchQuery
                  ? "No courses match your search criteria"
                  : "No available courses found"}
              </Alert>
            </Grid>
          ) : (
            filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card sx={{ 
                  height: "100%", 
                  transition: "transform 0.2s", 
                  "&:hover": { transform: "scale(1.02)" },
                  boxShadow: 3
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body2">
                        Teacher: {course.teacher?.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EventIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body2">
                        Sessions: {course.sessions?.length || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <DescriptionIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body2">
                        Materials: {course.materials?.length || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleCourseClick(course)}
                      fullWidth
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Dialog 
          open={courseDetailsDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">
                {selectedCourse?.name}
              </Typography>
              <IconButton onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body1" paragraph>
                  {selectedCourse?.description}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    Teacher: {selectedCourse?.teacher?.name}
                  </Typography>
                </Box>
              </Grid>

              {enrollSuccess && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    {successMessage}
                  </Alert>
                </Grid>
              )}

              {errorMessage && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    {errorMessage}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button
              onClick={() => handleEnroll(selectedCourse?.id)}
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {loading ? "Enrolling..." : "Enroll Now"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AvailableCourses; 