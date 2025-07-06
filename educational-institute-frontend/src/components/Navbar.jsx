import React, { useState } from "react";
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
  FormControl,
  Menu,
  InputBase,
  Divider,
  Collapse,
  ListItemIcon,
  Tooltip
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import { decodeToken } from "../utils/decodeToken";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// Styled search input
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const { i18n, t } = useTranslation();
  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeToken(token) : null;
  const role = decodedToken?.role;
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:960px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);

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

  const handleMoreMenuOpen = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    // Implement search functionality here
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getMenuItems = () => {
    const items = [];

    if (role === "super_admin") {
      items.push(
        { label: "Super Admin Dashboard", path: "/superAdminDashboard" },
        { label: "Users", path: "/users" },
        { label: "Institute Reports", path: "/institute-reports" },
        { label: "System Settings", path: "/system-settings" }
      );
    } else if (role === "institute_admin") {
      items.push(
        { label: "Users", path: "/institution-users" },
        { label: "Students", path: "/students" },
        { label: "Courses", path: "/courses" },
        { label: "Reports", path: "/reports-management" },
        { label: "Payments", path: "/payments" },
        { label: "Attendances", path: "/attendance-management" },
        { label: "Expenses", path: "/expenses" },
        { label: "Points", path: "/points-management" },
        { label: "Notifications", path: "/notifications" },
        { label: "Enrollment Requests", path: "/course-enrollment-requests" },
        { label: "Teacher Assignments", path: "/teacher-assignments" },
        { label: "Financial Summary", path: "/financial-summary" }
      );
    } else if (role === "secretary") {
      items.push(
        { label: "Students", path: "/students" },
        { label: "Student Enrollment", path: "/student-enrollment" },
        { label: "Invoice Management", path: "/invoice-management" },
        { label: "Attendance Reports", path: "/attendance-reports" }
      );
    } else if (role === "student") {
      items.push(
        { label: t('studentDashboard.title'), path: "/student-dashboard" },
        { label: t('studentDashboard.myCourses'), path: "/my-courses-student" },
        { label: t('studentDashboard.availableCourses'), path: "/student/available-courses" },
        { label: t('studentDashboard.courseSchedule'), path: "/course-schedule" },
        { label: t('studentDashboard.attendance'), path: "/attendance-summary" },
        { label: t('studentDashboard.points'), path: "/points-rewards" },
        { label: t('studentDashboard.payments'), path: "/payment-slip" },
        { label: t('studentDashboard.materials'), path: "/course-materials" }
      );
    } else if (role === "accountant") {
      items.push(
        { label: "Dashboard", path: "/accountant" },
     
      );
    }

    return items;
  };

  const renderMenuItems = (items, isDrawer = false) => {
    const visibleItems = isTablet ? items.slice(0, 4) : items.slice(0, 6);
    const moreItems = items.slice(isTablet ? 4 : 6);

    return (
      <>
        {visibleItems.map((item, index) => (
          <Button
            key={index}
            color="inherit"
            component={Link}
            to={item.path}
            sx={{ 
              minWidth: 'auto',
              px: 1,
              mx: 0.5,
              whiteSpace: 'nowrap',
              fontSize: isDrawer ? '1rem' : '0.875rem'
            }}
          >
            {item.label}
          </Button>
        ))}
        {moreItems.length > 0 && !isDrawer && (
          <>
            <IconButton
              color="inherit"
              onClick={handleMoreMenuOpen}
              sx={{ ml: 1 }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={moreMenuAnchor}
              open={Boolean(moreMenuAnchor)}
              onClose={handleMoreMenuClose}
              PaperProps={{
                sx: { maxHeight: 400 }
              }}
            >
              {moreItems.map((item, index) => (
                <MenuItem
                  key={index}
                  component={Link}
                  to={item.path}
                  onClick={handleMoreMenuClose}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </>
    );
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
            sx={{ 
              fontWeight: "bold", 
              color: "white", 
              fontFamily: "monospace", 
              letterSpacing: ".3rem",
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}
            component={Link}
            to="/"
          >
            Think
          </Typography>
        </Box>

        {!isMobile && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </Search>
        )}

        {isMobile ? (
          <>
            {languageSelector}
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer 
              anchor="right" 
              open={drawerOpen} 
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: { width: { xs: '100%', sm: 300 } }
              }}
            >
              <List sx={{ pt: 2 }}>
                {isMobile && (
                  <ListItem>
                    <Search sx={{ width: '100%' }}>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                        fullWidth
                      />
                    </Search>
                  </ListItem>
                )}
                {getMenuItems().map((item, index) => (
                  <ListItem 
                    key={index} 
                    onClick={toggleDrawer(false)}
                    sx={{ 
                      py: 1,
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                  >
                    <Button
                      component={Link}
                      to={item.path}
                      fullWidth
                      sx={{ 
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        fontSize: '1rem'
                      }}
                    >
                      {item.label}
                    </Button>
                  </ListItem>
                ))}
                {token && (
                  <>
                    <Divider />
                    <ListItem>
                      <Button
                        onClick={handleLogout}
                        fullWidth
                        startIcon={<LogoutIcon />}
                        sx={{ 
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          color: 'error.main'
                        }}
                      >
                        Logout
                      </Button>
                    </ListItem>
                  </>
                )}
                {role === "accountant" && (
                  <>
                    <ListItem button onClick={() => navigate("/accountant")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/accountant/payments")}>
                      <ListItemIcon>
                        <AttachMoneyIcon />
                      </ListItemIcon>
                      <ListItemText primary="Payments" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/accountant/expenses")}>
                      <ListItemIcon>
                        <ReceiptIcon />
                      </ListItemIcon>
                      <ListItemText primary="Expenses" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/accountant/cash-flow")}>
                      <ListItemIcon>
                        <TrendingUpIcon />
                      </ListItemIcon>
                      <ListItemText primary="Cash Flow" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/accountant/discounts")}>
                      <ListItemIcon>
                        <LocalOfferIcon />
                      </ListItemIcon>
                      <ListItemText primary="Discounts" />
                    </ListItem>
                  </>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {renderMenuItems(getMenuItems())}
            {languageSelector}
            {token && (
              <Tooltip title="Logout">
                <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;