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
} from "@mui/material";
import {
  School as SchoolIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  Payment as PaymentIcon,
  Book as BookIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { decodeToken } from "../../utils/decodeToken";

const StudentDashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalPoints: 0,
    attendanceRate: 0,
    upcomingSessions: 0,
  });
  const isMobile = useMediaQuery("(max-width:600px)");

  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const studentId = user?.userId;

  useEffect(() => {
    if (studentId) {
      fetchStudentStats();
    }
  }, [studentId]);

  const fetchStudentStats = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/student/${studentId}/stats`);
      if (response.data.succeed) {
        setStats(response.data.data);
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch student statistics.");
      }
    } catch (error) {
      console.error("Error fetching student stats:", error);
      setError(error.response?.data?.message || "Failed to fetch student statistics. Please try again later.");
    } finally {
      setLoading(false);
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
          <Button variant="contained" onClick={fetchStudentStats}>
            Retry
          </Button>
        </Box>
      );
    }

    return (
      <>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
          {t('studentDashboard.title')}
        </Typography>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center", height: '100%' }}>
              <Typography variant="h6" color="primary">
                {stats.totalCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('studentDashboard.totalCourses')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center", height: '100%' }}>
              <Typography variant="h6" color="primary">
                {stats.totalPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('studentDashboard.totalPoints')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center", height: '100%' }}>
              <Typography variant="h6" color="primary">
                {stats.attendanceRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('studentDashboard.attendanceRate')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center", height: '100%' }}>
              <Typography variant="h6" color="primary">
                {stats.upcomingSessions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('studentDashboard.upcomingSessions')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Dashboard Items */}
        <Grid container spacing={3}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {item.icon}
                    <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={item.link}
                    variant="contained"
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

  const dashboardItems = [
    {
      title: t('studentDashboard.myCourses'),
      description: t('studentDashboard.myCoursesDesc'),
      icon: <SchoolIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      link: "/my-courses-student",
    },
    {
      title: t('studentDashboard.courseSchedule'),
      description: t('studentDashboard.courseScheduleDesc'),
      icon: <EventIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      link: "/course-schedule",
    },
    {
      title: t('studentDashboard.attendance'),
      description: t('studentDashboard.attendanceDesc'),
      icon: <AssignmentIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      link: "/attendance-summary",
    },
    {
      title: t('studentDashboard.points'),
      description: t('studentDashboard.pointsDesc'),
      icon: <StarIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      link: "/points-rewards",
    },
    {
      title: t('studentDashboard.payments'),
      description: t('studentDashboard.paymentsDesc'),
      icon: <PaymentIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      link: "/payment-slip",
    },
    {
      title: t('studentDashboard.materials'),
      description: t('studentDashboard.materialsDesc'),
      icon: <BookIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      link: "/course-materials",
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {renderContent()}
      </Container>
    </Box>
  );
};

export default StudentDashboard;