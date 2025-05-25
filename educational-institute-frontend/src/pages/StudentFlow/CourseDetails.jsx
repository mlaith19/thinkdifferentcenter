import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  School as SchoolIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const CourseDetails = () => {
  const { courseId } = useParams();
  const { t } = useTranslation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data.data);
      } catch (err) {
        setError(t('courseDetails.error'));
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, t]);

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

  if (!course) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">{t('courseDetails.notFound')}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ p: 4, bgcolor: "background.default", flex: 1 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
          {t('courseDetails.title')}: {course.name}
        </Typography>

        <Grid container spacing={3}>
          {/* Course Overview Card */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                  {t('courseDetails.overview')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <MoneyIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        <strong>{t('courseDetails.paymentType')}:</strong> {course.paymentType}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        <strong>{t('courseDetails.registrationPeriod')}:</strong>{" "}
                        {new Date(course.registrationStartDate).toLocaleDateString()} -{" "}
                        {new Date(course.registrationEndDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <GroupIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        <strong>{t('courseDetails.ageRange')}:</strong> {course.minAge} - {course.maxAge} {t('courseDetails.years')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        <strong>{t('courseDetails.sessions')}:</strong> {course.numberOfSessions}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Status and Progress Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  {t('courseDetails.progress')}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('courseDetails.overallProgress')}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress || 0}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {course.progress || 0}%
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('courseDetails.attendanceRate')}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={course.attendanceRate || 0}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {course.attendanceRate || 0}%
                  </Typography>
                </Box>
                <Chip
                  label={course.status.toUpperCase()}
                  color={course.status === "active" ? "success" : "default"}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Teacher Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  {t('courseDetails.teacherInfo')}
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    <strong>{t('courseDetails.name')}:</strong> {course.teacher.fullName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>{t('courseDetails.email')}:</strong> {course.teacher.email}
                </Typography>
                {course.teacher.phone && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('courseDetails.phone')}:</strong> {course.teacher.phone}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Branch Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  {t('courseDetails.branchInfo')}
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    <strong>{t('courseDetails.name')}:</strong> {course.branch.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>{t('courseDetails.address')}:</strong> {course.branch.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>{t('courseDetails.phone')}:</strong> {course.branch.phone}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CourseDetails; 