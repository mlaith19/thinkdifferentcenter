import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import Navbar from "../components/Navbar"; // Import the Navbar component

const InstituteAdminDashboard = () => {
  // Static data for demonstration
  const branches = [
    { id: 1, name: "Main Branch", address: "123 Main St", phone: "555-1234" },
    { id: 2, name: "Downtown Branch", address: "456 Downtown St", phone: "555-5678" },
  ];

  const courses = [
    { id: 1, name: "Mathematics", paymentType: "full_course", price: 200 },
    { id: 2, name: "Science", paymentType: "per_session", price: 50 },
  ];

  const financialReports = [
    { id: 1, period: "monthly", totalRevenue: 10000, netProfit: 5000 },
    { id: 2, period: "quarterly", totalRevenue: 30000, netProfit: 15000 },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    mb: 2,
                  }}
                >
                  <SchoolIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Institute Name
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin
                </Typography>
              </Box>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Students" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <ClassIcon />
                  </ListItemIcon>
                  <ListItemText primary="Classes" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Assignments" />
                </ListItem>
                <Divider sx={{ my: 2 }} />
                <ListItem button>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Main Dashboard */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {/* Quick Actions */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="contained" startIcon={<PeopleIcon />}>
                      Add Student
                    </Button>
                    <Button variant="contained" startIcon={<ClassIcon />}>
                      Create Class
                    </Button>
                    <Button variant="contained" startIcon={<AssignmentIcon />}>
                      Assign Task
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* Branches Accordion */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Branches
                  </Typography>
                  {branches.map((branch) => (
                    <Accordion key={branch.id}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{branch.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <strong>Address:</strong> {branch.address}
                        </Typography>
                        <Typography>
                          <strong>Phone:</strong> {branch.phone}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Paper>
              </Grid>

              {/* Courses */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Courses
                  </Typography>
                  <List>
                    {courses.map((course) => (
                      <ListItem key={course.id}>
                        <ListItemText
                          primary={course.name}
                          secondary={`${course.paymentType} - $${course.price}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              {/* Financial Reports */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Financial Reports
                  </Typography>
                  <List>
                    {financialReports.map((report) => (
                      <ListItem key={report.id}>
                        <ListItemText
                          primary={`${report.period} Report`}
                          secondary={`Revenue: $${report.totalRevenue}, Profit: $${report.netProfit}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default InstituteAdminDashboard;