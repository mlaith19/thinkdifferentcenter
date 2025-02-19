import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Tooltip,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import { useParams } from "react-router-dom";
import api from "../../services/api"; // Adjust the import path as needed
import { cleanAndParse } from "../../utils/cleanAndParse"; // Import the utility function

const CourseManageDetails = () => {
  const { courseId } = useParams(); // Get the courseId from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const [students, setStudents] = useState([]); // State for students
 const [studentsLoading, setStudentsLoading] = useState(true); // Loading state for students

  // Fetch course data on component mount
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
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get(`/courses/${courseId}/students`);
        setStudents(response.data.data); // Set the students data
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  if (loading|| studentsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Full viewport height
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Course not found.</Typography>
      </Box>
    );
  }

  // Parse scheduleDays and sessionDates using the utility function
  const scheduleDays = cleanAndParse(course.scheduleDays || "[]");
  const sessionDates = cleanAndParse(course.sessionDates || "[]");

 

 

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Course Details: {course.name}
      </Typography>

      <Grid container spacing={4}>
        {/* Course Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Course Information
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Description:</strong> {course.description}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
  <strong>Registration Period:</strong>{" "}
  {new Date(course.registrationStartDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}{" "}
   - to - {" "}
  {new Date(course.registrationEndDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
</Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Price:</strong> {course.price} ({course.paymentType})
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
  <strong>Schedule Days:</strong>{" "}
  {scheduleDays.length > 0 ? scheduleDays.join(", ") : "No schedule days available"}
</Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Number of Sessions:</strong> {course.numberOfSessions}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Status:</strong> {course.status}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Session Dates */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Session Dates
              </Typography>
              <List>
                {sessionDates.map((session, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <EventIcon sx={{ mr: 2, color: "action.active" }} />
                    <ListItemText
                      primary={session.title}
                      secondary={session.date}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* List of Participating Students */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Participating Students
                </Typography>
                <Tooltip title="Add Student">
                  <IconButton color="primary">
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <List>
                {students.map((student) => (
                  <ListItem key={student.id} sx={{ py: 1 }}>
                    <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                      <PersonIcon />
                    </Avatar>
                    <ListItemText
                      primary={student.student.fullName}
                      secondary={student.student.email}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Instructors Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Instructors
              </Typography>
              <List>
                {    <ListItem key={course.teacherId} sx={{ py: 1 }}>
                    <Avatar sx={{ mr: 2, bgcolor: "secondary.main" }}>
                      <PersonIcon />
                    </Avatar>
                    <ListItemText
                      primary={course.teacherName}
                      secondary={`----------`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItem>}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseManageDetails;