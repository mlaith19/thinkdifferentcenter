import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import FloatingActionButton from "../components/FloatingActionButton";
import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Navbar from "../components/Navbar"; // Navbar component

const SuperAdminDashboard = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const response = await api.get("/institute");
      console.log(response.data.toString());
      setInstitutes(response.data.data);
    } catch (error) {
      setError(`Failed to fetch institutes.`);
      console.error("Error fetching institutes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (instituteId) => {
    console.log("Edit institute with ID:", instituteId);
    // You can navigate to the edit page here
  };

  const handleDelete = async (instituteId) => {
    try {
      await api.delete(`/institute/${instituteId}`);
      setInstitutes(institutes.filter((institute) => institute.id !== instituteId));
    } catch (error) {
      setError("Failed to delete institute. Please try again.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar /> {/* Navbar is always displayed */}

      <Box sx={{ p: 4 }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress /> {/* Loader displayed in the center */}
          </Box>
        ) : error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
            flexDirection="column"
          >
            <ErrorIcon style={{ fontSize: 60, color: "red" }} />
            <Typography variant="h6" color="textSecondary">
              {error}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
              Institutes
            </Typography>

            {institutes.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="50vh"
                flexDirection="column"
              >
                <ErrorIcon style={{ fontSize: 60, color: "gray" }} />
                <Typography variant="h6" color="textSecondary">
                  No institutes added yet.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
                  gap: 4,
                }}
              >
                {institutes.map((institute) => (
                  <Card key={institute.id} sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <Box
                      sx={{
                        height: 150,
                        backgroundImage: `url(/university.png)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <CardContent>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                        {institute.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {institute.email}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                          Admin:
                        </Typography>
                        {institute.admin ? (
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {institute.admin.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {institute.admin.email}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No admin assigned.
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                          Branches:
                        </Typography>
                        {institute.branches.map((branch) => (
                          <Box key={branch.id} sx={{ ml: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              {branch.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {branch.address || "No address provided"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {branch.phone || "No phone provided"}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                      <IconButton onClick={() => handleEdit(institute.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(institute.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </>
        )}

        <FloatingActionButton />
      </Box>
    </Box>
  );
};

export default SuperAdminDashboard;
