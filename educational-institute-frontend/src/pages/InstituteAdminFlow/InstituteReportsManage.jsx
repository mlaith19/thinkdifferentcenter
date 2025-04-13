import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  FormControl,
  TableRow,
  IconButton,
  Tooltip,
  Divider,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dummy data for reports
const courseReports = [
  {
    id: 1,
    name: "Mathematics 101",
    students: 50,
    revenue: 10000,
    status: "Active",
  },
  {
    id: 2,
    name: "Physics 101",
    students: 30,
    revenue: 6000,
    status: "Completed",
  },
  {
    id: 3,
    name: "Chemistry 101",
    students: 40,
    revenue: 8000,
    status: "Upcoming",
  },
];

const branchReports = [
  { id: 1, name: "Main Branch", courses: 10, students: 200, revenue: 50000 },
  { id: 2, name: "Downtown Branch", courses: 8, students: 150, revenue: 40000 },
  { id: 3, name: "Suburb Branch", courses: 5, students: 100, revenue: 30000 },
];

const teacherReports = [
  { id: 1, name: "Dr. Smith", courses: 5, students: 100, rating: 4.5 },
  { id: 2, name: "Dr. Johnson", courses: 4, students: 80, rating: 4.2 },
  { id: 3, name: "Dr. Brown", courses: 3, students: 60, rating: 4.0 },
];

const financialReports = [
  { month: "Jan", revenue: 10000, expenses: 5000, profit: 5000 },
  { month: "Feb", revenue: 12000, expenses: 6000, profit: 6000 },
  { month: "Mar", revenue: 15000, expenses: 7000, profit: 8000 },
  { month: "Apr", revenue: 13000, expenses: 6500, profit: 6500 },
  { month: "May", revenue: 14000, expenses: 7000, profit: 7000 },
];

const InstituteReportsScreen = () => {
  const [reportType, setReportType] = useState("course");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredCourseReports = courseReports.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBranchReports = branchReports.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeacherReports = teacherReports.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}
      >
        Reports
      </Typography>

      {/* Filters and Search */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "action.active" }} />
            ),
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Report Type</InputLabel>
          <Select
            value={reportType}
            onChange={handleReportTypeChange}
            label="Report Type"
          >
            <MenuItem value="course">Course Reports</MenuItem>
            <MenuItem value="branch">Branch Reports</MenuItem>
            <MenuItem value="teacher">Teacher Reports</MenuItem>
            <MenuItem value="financial">Financial Reports</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={handleFilterChange} label="Filter">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Download Report">
          <IconButton color="primary">
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Report Cards */}
      <Grid container spacing={4}>
        {/* Course Reports */}
        {reportType === "course" && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={3}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Course Reports
                  </Typography>
                  <Button variant="contained" startIcon={<BarChartIcon />}>
                    View Analytics
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Students</TableCell>
                        <TableCell>Revenue</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCourseReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.name}</TableCell>
                          <TableCell>{report.students}</TableCell>
                          <TableCell>${report.revenue}</TableCell>
                          <TableCell>
                            <Chip
                              label={report.status}
                              color={
                                report.status === "Active"
                                  ? "success"
                                  : report.status === "Completed"
                                  ? "warning"
                                  : "info"
                              }
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
        )}

        {/* Branch Reports */}
        {reportType === "branch" && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={3}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Branch Reports
                  </Typography>
                  <Button variant="contained" startIcon={<PieChartIcon />}>
                    View Analytics
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Branch Name</TableCell>
                        <TableCell>Courses</TableCell>
                        <TableCell>Students</TableCell>
                        <TableCell>Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredBranchReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.name}</TableCell>
                          <TableCell>{report.courses}</TableCell>
                          <TableCell>{report.students}</TableCell>
                          <TableCell>${report.revenue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Teacher Reports */}
        {reportType === "teacher" && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={3}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Teacher Reports
                  </Typography>
                  <Button variant="contained" startIcon={<TableChartIcon />}>
                    View Analytics
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Teacher Name</TableCell>
                        <TableCell>Courses</TableCell>
                        <TableCell>Students</TableCell>
                        <TableCell>Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTeacherReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.name}</TableCell>
                          <TableCell>{report.courses}</TableCell>
                          <TableCell>{report.students}</TableCell>
                          <TableCell>{report.rating}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Financial Reports */}
        {reportType === "financial" && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={3}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Financial Reports
                  </Typography>
                  <Button variant="contained" startIcon={<BarChartIcon />}>
                    View Analytics
                  </Button>
                </Box>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={financialReports}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="profit" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default InstituteReportsScreen;
