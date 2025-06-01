import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  useMediaQuery, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";
import { decodeToken } from "../utils/decodeToken";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";

const Navbar = () => {
  const { i18n, t } = useTranslation();
  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeToken(token) : null;
  const role = decodedToken?.role;
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const renderButtons = () => {
    const buttons = [];

    if (role === "super_admin") {
      buttons.push(
        <Button key="superAdminDashboard" color="inherit" component={Link} to="/superAdminDashboard">
          Super Admin Dashboard
        </Button>,
        <Button key="users" color="inherit" component={Link} to="/users">
          Users
        </Button>,
        <Button key="institute-reports" color="inherit" component={Link} to="/institute-reports">
          Institute Reports
        </Button>,
        <Button key="system-settings" color="inherit" component={Link} to="/system-settings">
          System Settings
        </Button>
      );
    } else if (role === "institute_admin") {
      buttons.push(
        <Button key="institution-users" color="inherit" component={Link} to="/institution-users">
          Users
        </Button>,
        <Button key="students" color="inherit" component={Link} to="/students">
          Students
        </Button>,
        <Button key="courses" color="inherit" component={Link} to="/courses">
          Courses
        </Button>,
        <Button key="reports" color="inherit" component={Link} to="/reports-management">
          Reports
        </Button>,
        <Button key="payments" color="inherit" component={Link} to="/payments">
          Payments
        </Button>,
        <Button key="attendances" color="inherit" component={Link} to="/attendance-management">
          Attendances
        </Button>,
        <Button key="expenses" color="inherit" component={Link} to="/expenses">
          Expenses
        </Button>,
        <Button key="points" color="inherit" component={Link} to="/points-management">
          Points
        </Button>,
        <Button key="notifications" color="inherit" component={Link} to="/notifications">
          Notifications
        </Button>,
        <Button key="enrollment-requests" color="inherit" component={Link} to="/course-enrollment-requests">
          Enrollment Requests
        </Button>,
        <Button key="teacher-assignments" color="inherit" component={Link} to="/teacher-assignments">
          Teacher Assignments
        </Button>,
        <Button key="financial-summary" color="inherit" component={Link} to="/financial-summary">
          Financial Summary
        </Button>
      );
    } else if (role === "secretary") {
      buttons.push(
        <Button key="students" color="inherit" component={Link} to="/students">
          Students
        </Button>,
        <Button key="student-enrollment" color="inherit" component={Link} to="/student-enrollment">
          Student Enrollment
        </Button>,
        <Button key="invoice-management" color="inherit" component={Link} to="/invoice-management">
          Invoice Management
        </Button>,
        <Button key="attendance-reports" color="inherit" component={Link} to="/attendance-reports">
          Attendance Reports
        </Button>
      );
    } else if (role === "teacher") {
    
    } else if (role === "student") {
      buttons.push(
        <Button key="student-dashboard" color="inherit" component={Link} to="/student-dashboard">
          {t('studentDashboard.title')}
        </Button>,
        <Button key="my-courses-student" color="inherit" component={Link} to="/my-courses-student">
          {t('studentDashboard.myCourses')}
        </Button>,
        <Button key="available-courses" color="inherit" component={Link} to="/student/available-courses">
          {t('studentDashboard.availableCourses')}
        </Button>,
        <Button key="course-schedule" color="inherit" component={Link} to="/course-schedule">
          {t('studentDashboard.courseSchedule')}
        </Button>,
        <Button key="attendance-summary" color="inherit" component={Link} to="/attendance-summary">
          {t('studentDashboard.attendance')}
        </Button>,
        <Button key="points-rewards" color="inherit" component={Link} to="/points-rewards">
          {t('studentDashboard.points')}
        </Button>,
        <Button key="payment-slip" color="inherit" component={Link} to="/payment-slip">
          {t('studentDashboard.payments')}
        </Button>,
        <Button key="course-materials" color="inherit" component={Link} to="/course-materials">
          {t('studentDashboard.materials')}
        </Button>
      );
    } else if (role === "accountant") {
      buttons.push(
        <Button key="accountants" color="inherit" component={Link} to="/accountants">
          Accountants
        </Button>,
        <Button key="financial-reports" color="inherit" component={Link} to="/financial-reports">
          Financial Reports
        </Button>,
        <Button key="payment-tracking" color="inherit" component={Link} to="/payment-tracking">
          Payment Tracking
        </Button>,
        <Button key="discount-management" color="inherit" component={Link} to="/discount-management">
          Discount Management
        </Button>
      );
    }

    if (!token) {
      buttons.push(
        <Button key="login" color="inherit" component={Link} to="/login">
          Login
        </Button>
      );
    }

    if (token) {
      buttons.push(
        <IconButton key="logout" color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      );
    }

    return buttons;
  };

  const languageSelector = (
    <FormControl size="small" sx={{ minWidth: 120, mx: 2 }}>
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        sx={{ 
          color: 'white',
          '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '.MuiSvgIcon-root': { color: 'white' }
        }}
        IconComponent={LanguageIcon}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ar">العربية</MenuItem>
        <MenuItem value="he">עברית</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main", boxShadow: 3 }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <LockIcon sx={{ fontSize: 40, color: "white", mr: 2 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "white", fontFamily: "monospace", letterSpacing: ".3rem" }}
            component={Link}
            to="/"
          >
            Think
          </Typography>
        </Box>

        {isMobile ? (
          <>
            {languageSelector}
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <List>
                {renderButtons().map((button, index) => (
                  <ListItem key={index} onClick={toggleDrawer(false)}>
                    {button}
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {renderButtons()}
            {languageSelector}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;