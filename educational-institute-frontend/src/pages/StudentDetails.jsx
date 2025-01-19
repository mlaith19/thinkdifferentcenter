import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material";
import {
  School as SchoolIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Star as StarIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StudentDetails = () => {
  // Static student data
  const student = {
    name: "ATEF ABRAHEM",
    id: "123456779",
    phone: "0500000000",
    religion: "none",
    birthDate: "2000-01-01",
    courses: [
      {
        id: 1,
        name: "Mathematics",
        fromDate: "2023-09-01",
        toDate: "2023-12-15",
        instructor: "Dr. Smith",
        status: "Ongoing",
      },
      {
        id: 2,
        name: "Physics",
        fromDate: "2023-09-01",
        toDate: "2023-12-15",
        instructor: "Dr. Johnson",
        status: "Completed",
      },
      {
        id: 3,
        name: "Chemistry",
        fromDate: "2024-01-10",
        toDate: "2024-04-20",
        instructor: "Dr. Brown",
        status: "Upcoming",
      },
    ],
    behaviorEvents: [
      {
        id: 1,
        title: "Excellent Participation",
        date: "2023-10-15",
        details: "Active participation in class discussions.",
        type: "positive",
        score: 10, // Added score for the chart
      },
      {
        id: 2,
        title: "Late Submission",
        date: "2023-11-05",
        details: "Submitted assignment 2 days late.",
        type: "negative",
        score: -5, // Added score for the chart
      },
      {
        id: 3,
        title: "Outstanding Performance",
        date: "2023-12-10",
        details: "Scored highest in the midterm exam.",
        type: "positive",
        score: 15, // Added score for the chart
      },
      {
        id: 4,
        title: "Disruptive Behavior",
        date: "2023-12-20",
        details: "Disrupted class during a lecture.",
        type: "negative",
        score: -10, // Added score for the chart
      },
    ],
  };

  // Format data for the line chart
  const chartData = student.behaviorEvents.map((event) => ({
    date: event.date,
    score: event.score,
    type: event.type,
  }));

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Student Details
      </Typography>

      {/* Student Overview Card */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            Student Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="body1">
                  <strong>Name:</strong> {student.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" alignItems="center">
                <CakeIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="body1">
                  <strong>Birth Date:</strong> {student.birthDate}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" alignItems="center">
                <PhoneIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="body1">
                  <strong>Phone:</strong> {student.phone}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" alignItems="center">
                <SchoolIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="body1">
                  <strong>Depit:</strong> {student.religion}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Meeting Details by Course Card */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            Meeting Details by Course
          </Typography>
          {student.courses.length > 0 ? (
            <List>
              {student.courses.map((course) => (
                <ListItem key={course.id} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                    <SchoolIcon />
                  </Avatar>
                  <ListItemText
                    primary={course.name}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Instructor:</strong> {course.instructor}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Dates:</strong> {course.fromDate} - {course.toDate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Status:</strong>{" "}
                          <Chip
                            label={course.status}
                            size="small"
                            color={
                              course.status === "Ongoing"
                                ? "primary"
                                : course.status === "Completed"
                                ? "success"
                                : "warning"
                            }
                          />
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No meetings registered.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Behavior and Events Card */}
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            Behavior and Events
          </Typography>
          {student.behaviorEvents.length > 0 ? (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No behavior events recorded.
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary">
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentDetails;