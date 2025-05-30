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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  School as SchoolIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  ExpandMore as ExpandMoreIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import api from "../../services/api";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data.data);
      } catch (err) {
        setError("Failed to fetch course details.");
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

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
        <Alert severity="info">Course not found.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Course Details: {course.name}
      </Typography>

      <Grid container spacing={3}>
        {/* Course Overview Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                Course Overview
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
                      <strong>Payment Type:</strong> {course.paymentType}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      <strong>Registration Period:</strong>{" "}
                      {new Date(course.registrationStartDate).toLocaleDateString()} -{" "}
                      {new Date(course.registrationEndDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <GroupIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      <strong>Age Range:</strong> {course.minAge} - {course.maxAge} years
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      <strong>Number of Sessions:</strong> {course.numberOfSessions}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Status and Quick Info Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Quick Info
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={course.status.toUpperCase()}
                  color={course.status === "active" ? "success" : "default"}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Auto Generate Schedule:</strong>{" "}
                {course.autoGenerateSchedule ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Enrolled Students:</strong> {course.studentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Teacher Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Teacher Information
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body1">
                  <strong>Name:</strong> {course.teacher.fullName}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {course.teacher.email}
              </Typography>
              {course.teacher.phone && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong> {course.teacher.phone}
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
                Branch Information
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body1">
                  <strong>Name:</strong> {course.branch.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Address:</strong> {course.branch.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Phone:</strong> {course.branch.phone}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sessions List */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Course Sessions
                    </Typography>
                    <Chip
                      label={`${course.sessions?.length || 0} Sessions`}
                      color="primary"
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {course.sessions && course.sessions.length > 0 ? (
                    course.sessions.map((session, index) => (
                      <Accordion key={session.id} sx={{ mb: 1 }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography>
                              Session {index + 1} - {new Date(session.date).toLocaleDateString()}
                            </Typography>
                            <Chip
                              label={session.status.toUpperCase()}
                              color={
                                session.status === 'completed' ? 'success' :
                                session.status === 'cancelled' ? 'error' : 'primary'
                              }
                              size="small"
                              sx={{ ml: 'auto' }}
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2">
                                <strong>Date:</strong> {new Date(session.date).toLocaleDateString()}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2">
                                <strong>Time:</strong> {session.startTime} - {session.endTime}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2">
                                <strong>Status:</strong> {session.status}
                              </Typography>
                            </Grid>
                            {session.notes && (
                              <Grid item xs={12}>
                                <Typography variant="body2">
                                  <strong>Notes:</strong> {session.notes}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No sessions scheduled yet.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* Enrolled Students */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Enrolled Students
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Birth Date</TableCell>
                      <TableCell>Enrollment Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {course.enrolledStudents.map((enrollment) => (
                      <TableRow key={enrollment.enrollmentId}>
                        <TableCell>{enrollment.student.fullName}</TableCell>
                        <TableCell>{enrollment.student.email}</TableCell>
                        <TableCell>{enrollment.student.phone}</TableCell>
                        <TableCell>
                          {new Date(enrollment.student.birthDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={enrollment.status.toUpperCase()}
                            color={enrollment.status === "active" ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseDetails; 