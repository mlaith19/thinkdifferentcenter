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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  LinearProgress,
  Container,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  HowToReg as EnrollmentIcon,
  AccessTime as AccessTimeIcon,
  Book as BookIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const MyCoursesStudent = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetailsDialog, setCourseDetailsDialog] = useState(false);
  const [materials, setMaterials] = useState([]);

  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const studentId = user?.userId;
  const instituteId = user?.instituteId;

  useEffect(() => {
    if (studentId) {
      fetchCourses();
    }
  }, [studentId]);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/student/${studentId}/courses`);
      if (response.data.succeed) {
        setCourses(response.data.data || []);
        setFilteredCourses(response.data.data || []);
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch courses.");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.response?.data?.message || "Failed to fetch courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.teacher?.name.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  };

  const handleCourseClick = async (course) => {
    setSelectedCourse(course);
    setCourseDetailsDialog(true);
    try {
      const response = await api.get(`/courses/${course.id}/materials`);
      setMaterials(response.data.data || []);
    } catch (error) {
      console.error("Error fetching course materials:", error);
    }
  };

  const handleCloseDialog = () => {
    setCourseDetailsDialog(false);
    setSelectedCourse(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const CourseCard = ({ course }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
      <Card 
        elevation={3} 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {course.name}
            </Typography>
            <Chip 
              label={t(`common.status.${course.status.toLowerCase()}`)} 
              color={getStatusColor(course.status)}
              size="small"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {course.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {t('studentDashboard.teacher')}: {course.teacher.fullName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {t('studentDashboard.nextSession')}: {course.nextSession}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {t('studentDashboard.totalSessions')}: {course.totalSessions}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BookIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {t('studentDashboard.materials')}: {course.totalMaterials}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('studentDashboard.progress')}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={course.progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {course.progress}% {t('studentDashboard.complete')}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('studentDashboard.enrollmentDate')}: {formatDate(course.enrollmentDate)}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => window.location.href = `/course-details/${course.id}`}
          >
            {t('common.actions.viewDetails')}
          </Button>
        </CardActions>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            mb: 4, 
            fontWeight: "bold", 
            color: "primary.main",
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          {t('studentDashboard.myCourses')}
      </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => window.location.href = '/student/available-courses'}
          >
            {t('studentDashboard.browseCourses')}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('studentDashboard.searchPlaceholder')}
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
                  ? t('studentDashboard.noCoursesFound')
                  : t('studentDashboard.noCourses')}
              </Alert>
            </Grid>
          ) : (
            filteredCourses.map((course) => (
              <Grid item xs={12} md={6} key={course.id}>
                <CourseCard course={course} />
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
                    {t('studentDashboard.teacher')}: {selectedCourse?.teacher?.fullName}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t('studentDashboard.courseMaterials')}
                </Typography>
              </Grid>

              {materials.length === 0 ? (
                <Grid item xs={12}>
                  <Alert severity="info">
                    {t('studentDashboard.noMaterials')}
                  </Alert>
                </Grid>
              ) : (
                materials.map((material) => (
                  <Grid item xs={12} key={material.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1">
                              {material.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {material.description}
                            </Typography>
                            <Chip
                              label={material.fileType.toUpperCase()}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            href={material.fileUrl}
                            target="_blank"
                            startIcon={<DownloadIcon />}
                          >
                            {t('studentDashboard.download')}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('common.actions.close')}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyCoursesStudent;