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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";

const InstituteAdminDashboard = () => {
  const [loadingInstitute, setLoadingInstitute] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingFinancialReports, setLoadingFinancialReports] = useState(true);
  const [error, setError] = useState("");
  const [institute, setInstitute] = useState(null);
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [financialReports, setFinancialReports] = useState([]);

  // Decode token to get user information
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.instituteId) return;
  
      try {
        await Promise.all([
          fetchInstitute(),
          fetchBranches(),
          fetchCourses(),
          fetchFinancialReports(),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    fetchData(); // Invoke the async function
  }, [user]);
  

  const fetchInstitute = async () => {
    try {
      const response = await api.get(`/institute/${user.instituteId}`);
      console.log(response.data.data);
      setInstitute(response.data.data);
    } catch (error) {
      setError("Failed to fetch institute data.");
      console.error("Error fetching institute:", error);
    } finally {
      setLoadingInstitute(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await api.get(`/institute/${user.instituteId}/branches`);
      console.log(response.data.branches);
      setBranches(response.data.branches);
    } catch (error) {
      setError("Failed to fetch branches data.");
      console.error("Error fetching branches:", error);
    } finally {
      setLoadingBranches(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get(`/institute/${user.instituteId}/courses`);
      console.log(response.data.data);
      setCourses(response.data.data);
    } catch (error) {
      setError("Failed to fetch courses data.");
      console.error("Error fetching courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchFinancialReports = async () => {
    try {
      const response = await api.get(`/institute/${user.instituteId}/financial-reports`);
      console.log(response.data.data);
      setFinancialReports(response.data.data);
    } catch (error) {
      setError("Failed to fetch financial reports data.");
      console.error("Error fetching financial reports:", error);
    } finally {
      setLoadingFinancialReports(false);
    }
  };

  if (!user || !user.instituteId) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          No institute data found.
        </Typography>
      </Box>
    );
  }

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
                <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", mb: 2 }}>
                  <SchoolIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {institute?.name || "Institute Name"}
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
                  {loadingBranches ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100px" }}>
                      <CircularProgress />
                    </Box>
                  ) : branches.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No branches found.
                    </Typography>
                  ) : (
                    branches.map((branch) => (
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
                    ))
                  )}
                </Paper>
              </Grid>

              {/* Courses */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Courses
                  </Typography>
                  {loadingCourses ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100px" }}>
                      <CircularProgress />
                    </Box>
                  ) : courses.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No courses found.
                    </Typography>
                  ) : (
                    <List>
                      {courses.map((course) => (
                        <ListItem key={course.id}>
                          <ListItemText primary={course.name} secondary={`${course.paymentType} - $${course.price}`} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>

              {/* Financial Reports */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Financial Reports
                  </Typography>
                  {loadingFinancialReports ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100px" }}>
                      <CircularProgress />
                    </Box>
                  ) : financialReports.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No financial reports found.
                    </Typography>
                  ) : (
                    <List>
                      {financialReports.map((report) => (
                        <ListItem key={report.id}>
                          <ListItemText primary={`${report.period} Report`} secondary={`Revenue: $${report.totalRevenue}, Profit: $${report.netProfit}`} />
                        </ListItem>
                      ))}
                    </List>
                  )}
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