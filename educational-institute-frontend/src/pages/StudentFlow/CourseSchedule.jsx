import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { decodeToken } from "../../utils/decodeToken";

const CourseSchedule = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const studentId = user?.userId;

  useEffect(() => {
    if (studentId) {
      fetchSessions();
    }
  }, [studentId]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/student/${studentId}/sessions`);
      if (response.data.succeed) {
        setSessions(response.data.data || []);
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch sessions.");
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError(error.response?.data?.message || "Failed to fetch sessions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            fontWeight: "bold", 
            color: "primary.main",
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          {t('studentDashboard.courseSchedule')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>{t('studentDashboard.courseName')}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{t('studentDashboard.nextSession')}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{t('studentDashboard.status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No upcoming sessions found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.courseName}</TableCell>
                      <TableCell>
                        {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleString()}
                      </TableCell>
                      <TableCell>{session.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default CourseSchedule; 