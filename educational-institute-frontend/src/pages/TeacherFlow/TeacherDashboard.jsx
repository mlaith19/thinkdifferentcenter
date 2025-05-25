import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, Button, Grid, Card, CardContent, CardActions, useMediaQuery
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  School as SchoolIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  CloudUpload as CloudUploadIcon
} from "@mui/icons-material";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { decodeToken } from "../../utils/decodeToken";

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isMobile = useMediaQuery('(max-width:600px)');

  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const teacherId = user?.userId;
  const instituteId = user?.instituteId;

  useEffect(() => {
    fetchCourses();
  }, [teacherId]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/courses", {
        params: { instituteId }
      });
      const filteredCourses = response.data.data.filter(
        (course) => course.teacherId === teacherId
      );
      setCourses(filteredCourses);
    } catch (error) {
      setError("Failed to fetch courses.");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardItems = [
    {
      title: t('teacherDashboard.myCourses'),
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      path: "/my-courses",
      description: t('teacherDashboard.myCoursesDesc')
    },
    {
      title: t('teacherDashboard.courseSchedule'),
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      path: "/course-schedule",
      description: t('teacherDashboard.courseScheduleDesc')
    },
    {
      title: t('teacherDashboard.attendanceTracking'),
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      path: "/attendance-tracking",
      description: t('teacherDashboard.attendanceTrackingDesc')
    },
    {
      title: t('teacherDashboard.studentProgress'),
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      path: "/student-progress",
      description: t('teacherDashboard.studentProgressDesc')
    },
    {
      title: t('teacherDashboard.materialsUpload'),
      icon: <CloudUploadIcon sx={{ fontSize: 40 }} />,
      path: "/materials-upload",
      description: t('teacherDashboard.materialsUploadDesc')
    },
    {
      title: t('teacherDashboard.sessionManagement'),
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      path: "/sessions",
      description: t('teacherDashboard.sessionManagementDesc')
    }
  ];

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
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
          {t('teacherDashboard.title')}
        </Typography>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="primary">
                {courses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('teacherDashboard.activeCourses')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="primary">
                {courses.reduce((acc, course) => acc + course.studentCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('teacherDashboard.totalStudents')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Dashboard Grid */}
        <Grid container spacing={3}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {item.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
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
                    to={item.path}
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

        {/* Recent Courses */}
        <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            {t('teacherDashboard.recentCourses')}
          </Typography>
          {isMobile ? (
            <Box>
              {courses.slice(0, 3).map((course) => (
                <Box key={course.id} sx={{ mb: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('teacherDashboard.students')}: {course.studentCount}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    component={Link}
                    to={`/course-details/${course.id}`}
                    sx={{ mt: 1 }}
                  >
                    {t('common.actions.view')}
                  </Button>
                </Box>
              ))}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>{t('teacherDashboard.courseName')}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t('teacherDashboard.students')}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t('teacherDashboard.status')}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t('common.actions.view')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.slice(0, 3).map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.studentCount}</TableCell>
                      <TableCell>{course.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          component={Link}
                          to={`/course-details/${course.id}`}
                        >
                          {t('common.actions.view')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default TeacherDashboard;