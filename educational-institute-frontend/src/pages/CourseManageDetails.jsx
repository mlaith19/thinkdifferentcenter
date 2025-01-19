import React from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";

const CourseManageDetails = ({ courseId }) => {
  // Dummy data for students and instructors
  const students = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];

  const instructors = [
    { id: 1, name: "Dr. Smith", email: "smith@example.com" },
  ];

  // Dummy data for course plan (calendar view)
  const coursePlan = [
    { date: "2023-10-01", activity: "Introduction to Mathematics", type: "lecture" },
    { date: "2023-10-08", activity: "Algebra Basics", type: "lecture" },
    { date: "2023-10-15", activity: "Geometry Fundamentals", type: "workshop" },
    { date: "2023-10-22", activity: "Calculus Basics", type: "lecture" },
    { date: "2023-10-29", activity: "Midterm Exam", type: "exam" },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Course Details
      </Typography>

      <Grid container spacing={4}>
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
                      primary={student.name}
                      secondary={student.email}
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
                {instructors.map((instructor) => (
                  <ListItem key={instructor.id} sx={{ py: 1 }}>
                    <Avatar sx={{ mr: 2, bgcolor: "secondary.main" }}>
                      <PersonIcon />
                    </Avatar>
                    <ListItemText
                      primary={instructor.name}
                      secondary={instructor.email}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Course Plan Calendar */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <CalendarTodayIcon sx={{ mr: 1, color: "primary.main", fontSize: 30 }} />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Course Plan
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                From <strong>2023-10-01</strong> to <strong>2023-12-15</strong>
              </Typography>

              {/* Calendar-like Table */}
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Activity</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coursePlan.map((plan) => (
                      <TableRow key={plan.date}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <EventIcon sx={{ mr: 1, color: "action.active" }} />
                            <Typography>{plan.date}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>{plan.activity}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={plan.type}
                            color={
                              plan.type === "lecture"
                                ? "primary"
                                : plan.type === "workshop"
                                ? "secondary"
                                : "error"
                            }
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

export default CourseManageDetails;