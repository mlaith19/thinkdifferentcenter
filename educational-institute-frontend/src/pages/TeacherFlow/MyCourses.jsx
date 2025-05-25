import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  School as SchoolIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { decodeToken } from "../../utils/decodeToken";

const MyCourses = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

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
        params: { instituteId },
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
          {t('teacherDashboard.myCourses')}
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

        {/* Courses Grid/List */}
        {isMobile ? (
          <Box>
            {courses.map((course) => (
              <Card key={course.id} sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {course.name}
                    </Typography>
                    <Chip
                      label={course.status}
                      color={getStatusColor(course.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <GroupIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body2">
                      {t('teacherDashboard.students')}: {course.studentCount}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ScheduleIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body2">
                      {course.numberOfSessions} {t('teacherDashboard.sessions')}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                  <Button
                    component={Link}
                    to={`/course-details/${course.id}`}
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                  >
                    {t('common.actions.view')}
                  </Button>
                  <Box>
                    <Tooltip title={t('teacherDashboard.attendance')}>
                      <IconButton
                        component={Link}
                        to={`/attendance-tracking?courseId=${course.id}`}
                        color="primary"
                      >
                        <AssignmentIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('teacherDashboard.progress')}>
                      <IconButton
                        component={Link}
                        to={`/student-progress?courseId=${course.id}`}
                        color="primary"
                      >
                        <AssessmentIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            ))}
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>{t('teacherDashboard.courseName')}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{t('teacherDashboard.students')}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{t('teacherDashboard.sessions')}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{t('teacherDashboard.status')}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{t('teacherDashboard.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        {course.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <GroupIcon sx={{ mr: 1, color: "primary.main" }} />
                        {course.studentCount}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ScheduleIcon sx={{ mr: 1, color: "primary.main" }} />
                        {course.numberOfSessions}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.status}
                        color={getStatusColor(course.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title={t('common.actions.view')}>
                          <IconButton
                            component={Link}
                            to={`/course-details/${course.id}`}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('teacherDashboard.attendance')}>
                          <IconButton
                            component={Link}
                            to={`/attendance-tracking?courseId=${course.id}`}
                            color="primary"
                          >
                            <AssignmentIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('teacherDashboard.progress')}>
                          <IconButton
                            component={Link}
                            to={`/student-progress?courseId=${course.id}`}
                            color="primary"
                          >
                            <AssessmentIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default MyCourses;
