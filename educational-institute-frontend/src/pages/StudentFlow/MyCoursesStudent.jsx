import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  useMediaQuery,
  Container,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  School as SchoolIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Book as BookIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { decodeToken } from "../../utils/decodeToken";

const MyCoursesStudent = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");

  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const studentId = user?.userId;

  useEffect(() => {
    if (studentId) {
      fetchCourses();
    }
  }, [studentId]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/student/${studentId}/courses`);
      if (response.data.succeed) {
        setCourses(response.data.data);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "completed":
        return "info";
      case "upcoming":
        return "warning";
      default:
        return "default";
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="contained" onClick={fetchCourses}>
            Retry
          </Button>
        </Box>
      );
    }

    if (courses.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {t('myCoursesStudent.noCourses')}
          </Typography>
          <Button
            component={Link}
            to="/course-enrollment"
            variant="contained"
            sx={{ mt: 2 }}
          >
            {t('myCoursesStudent.enrollNow')}
          </Button>
        </Box>
      );
    }

    return (
      <>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
          {t('myCoursesStudent.title')}
        </Typography>

        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <SchoolIcon sx={{ fontSize: 40, color: "primary.main" }} />
                    <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                      {course.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('myCoursesStudent.progress')}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {course.progress}%
                    </Typography>
                  </Box>
                  {course.nextSession && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('myCoursesStudent.nextSession')}:
                      </Typography>
                      <Typography variant="body2">
                        {new Date(course.nextSession).toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip
                      label={course.status}
                      color={getStatusColor(course.status)}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {t('myCoursesStudent.attendanceRate')}: {course.attendanceRate}%
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={`/student/course-details/${course.id}`}
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    fullWidth
                  >
                    {t('common.actions.view')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {renderContent()}
      </Container>
    </Box>
  );
};

export default MyCoursesStudent;