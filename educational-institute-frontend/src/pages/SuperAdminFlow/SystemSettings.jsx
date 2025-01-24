import React, { useState } from "react";
import { Box, Typography, Paper, FormControlLabel, Switch, Button } from "@mui/material";

const SystemSettings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleDarkModeChange = (event) => {
    setDarkMode(event.target.checked);
  };

  const handleNotificationsChange = (event) => {
    setNotificationsEnabled(event.target.checked);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        System Settings
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={handleDarkModeChange} />}
          label="Dark Mode"
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={<Switch checked={notificationsEnabled} onChange={handleNotificationsChange} />}
          label="Enable Notifications"
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </Paper>
    </Box>
  );
};

export default SystemSettings;