import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";

const CourseEnrollment = () => {
  // Dummy data for courses
  const courses = [
    { id: 1, name: "Mathematics", description: "Learn advanced mathematics." },
    { id: 2, name: "Physics", description: "Explore the laws of physics." },
    { id: 3, name: "Chemistry", description: "Understand chemical reactions." },
  ];

  const handleEnroll = (courseId) => {
    console.log(`Enrolled in course ${courseId}`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Course Enrollment
      </Typography>
      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item key={course.id} xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  {course.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {course.description}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleEnroll(course.id)}
                >
                  Enroll
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseEnrollment;