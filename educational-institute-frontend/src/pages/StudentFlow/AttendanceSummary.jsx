import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  Divider,
  TextField,
  InputAdornment,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import api from '../../services/api';
import { decodeToken } from '../../utils/decodeToken';
import Navbar from '../../components/Navbar';

const AttendanceSummary = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const token = localStorage.getItem('token');
  const user = decodeToken(token);
  const studentId = user?.userId;

  useEffect(() => {
    fetchEnrolledCourses();
  }, [studentId]);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, courses]);

  const fetchEnrolledCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/student/${studentId}/courses`);
      if (response.data.succeed) {
        setCourses(response.data.data);
        setFilteredCourses(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching courses');
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
        course.description?.toLowerCase().includes(query) ||
        course.teacher?.fullName.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  };

  const handleCourseClick = async (courseId) => {
    if (selectedCourse === courseId) {
      setSelectedCourse(null);
      setAttendanceData(null);
      return;
    }

    setSelectedCourse(courseId);
    setLoadingAttendance(true);

    try {
      const response = await api.get(`/student/courses/${courseId}/attendance-summary`);
      if (response.data.succeed) {
        setAttendanceData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching attendance summary');
    } finally {
      setLoadingAttendance(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      case 'excused':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      // Handle time string in format "HH:mm:ss"
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant={isMobile ? 'h5' : 'h4'} 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            fontWeight: 'bold', 
            color: 'primary.main',
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          {t('attendanceSummary.title')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('attendanceSummary.searchPlaceholder')}
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

        {filteredCourses.length === 0 ? (
          <Alert severity="info">
            {searchQuery
              ? t('attendanceSummary.noSearchResults')
              : t('attendanceSummary.noCourses')}
          </Alert>
        ) : (
          <List component="nav" sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {filteredCourses.map((course) => (
              <React.Fragment key={course.id}>
                <ListItemButton onClick={() => handleCourseClick(course.id)}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon color="primary" />
                        <Typography variant="h6">{course.name}</Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <PersonIcon fontSize="small" color="primary" />
                          <Typography variant="body2">
                            {t('courseDetails.teacherInfo')}: {course.teacher?.fullName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EventIcon fontSize="small" color="primary" />
                          <Typography variant="body2">
                            {t('attendanceSummary.totalSessions')}: {course.totalSessions || 0}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  {selectedCourse === course.id ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={selectedCourse === course.id} timeout="auto" unmountOnExit>
                  {loadingAttendance ? (
                    <Box display="flex" justifyContent="center" p={3}>
                      <CircularProgress />
                    </Box>
                  ) : attendanceData && (
                    <Box p={2}>
                      {/* Course Information */}
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1">
                                <strong>{t('courseDetails.branchInfo')}:</strong> {attendanceData.course.branch.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1">
                                <strong>{t('attendanceSummary.totalSessions')}:</strong> {attendanceData.attendance.totalSessions}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>

                      {/* Attendance Statistics */}
                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card>
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                {t('attendance.present')}
                              </Typography>
                              <Typography variant="h4">
                                {attendanceData.attendance.statistics.present}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card>
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                {t('attendance.absent')}
                              </Typography>
                              <Typography variant="h4">
                                {attendanceData.attendance.statistics.absent}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card>
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                {t('attendance.late')}
                              </Typography>
                              <Typography variant="h4">
                                {attendanceData.attendance.statistics.late}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card>
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                {t('attendance.excused')}
                              </Typography>
                              <Typography variant="h4">
                                {attendanceData.attendance.statistics.excused}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>

                      {/* Sessions Table */}
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>{t('courseSchedule.date')}</TableCell>
                              <TableCell>{t('courseSchedule.startTime')}</TableCell>
                              <TableCell>{t('courseSchedule.endTime')}</TableCell>
                              <TableCell>{t('attendance.status')}</TableCell>
                              <TableCell>{t('attendance.notes')}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {attendanceData.attendance.sessions.map((session) => (
                              <TableRow key={session.id}>
                                <TableCell>
                                  {formatDate(session.date)}
                                </TableCell>
                                <TableCell>
                                  {formatTime(session.startTime)}
                                </TableCell>
                                <TableCell>
                                  {formatTime(session.endTime)}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={t(`attendance.${session.status}`)}
                                    color={getStatusColor(session.status)}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>{session.notes || '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Collapse>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default AttendanceSummary;