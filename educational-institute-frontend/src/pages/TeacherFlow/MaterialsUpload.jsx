import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { decodeToken } from "../../utils/decodeToken";
import Navbar from "../../components/Navbar";

const MaterialsUpload = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");

  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const teacherId = user?.userId;
  const instituteId = user?.instituteId;

  useEffect(() => {
    fetchCourses();
  }, [teacherId]);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/courses/institute/${instituteId}`);
      const filteredCourses = response.data.data.filter(
        (course) => course.teacherId === teacherId
      );
      setCourses(filteredCourses);
    } catch (error) {
      setError("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    setUploadDialog(true);
    setTitle("");
    setDescription("");
    setSelectedSession("");
    setFile(null);
    setFileType("");

    try {
      // Fetch course details which includes sessions
      const response = await api.get(`/courses/${course.id}`);
      const courseData = response.data.data;
      setSessions(courseData.sessions || []);

      // Fetch existing materials
      const materialsResponse = await api.get(`/courses/${course.id}/materials`);
      setMaterials(materialsResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching course data:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch course data",
        severity: "error"
      });
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type.split('/')[1] || '');
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !selectedSession) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error"
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('sessionId', selectedSession);
    formData.append('courseId', selectedCourse.id);
    formData.append('teacherId', teacherId);

    try {
      const response = await api.post('/materials/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSnackbar({
        open: true,
        message: "Material uploaded successfully",
        severity: "success"
      });

      // Refresh materials list
      const materialsResponse = await api.get(`/courses/${selectedCourse.id}/materials`);
      setMaterials(materialsResponse.data.data || []);

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedSession("");
      setFile(null);
      setFileType("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to upload material",
        severity: "error"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCloseDialog = () => {
    setUploadDialog(false);
    setSelectedCourse(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
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
          Materials Upload
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {courses.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Courses Available
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You don't have any courses assigned to you yet.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card sx={{ 
                  height: "100%", 
                  transition: "transform 0.2s", 
                  "&:hover": { transform: "scale(1.02)" },
                  boxShadow: 3
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body2">
                        Sessions: {course.sessions?.length || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <DescriptionIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body2">
                        Materials: {materials.filter(m => m.courseId === course.id).length}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleCourseSelect(course)}
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                    >
                      Upload Material
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Dialog 
          open={uploadDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">
                Upload Material - {selectedCourse?.name}
              </Typography>
              <IconButton onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Session</InputLabel>
                  <Select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    label="Select Session"
                  >
                    {sessions.map((session) => (
                      <MenuItem key={session.id} value={session.id}>
                        {new Date(session.date).toLocaleDateString()} - {session.startTime}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                  <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" gutterBottom>
                    {file ? file.name : 'Click to upload file'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX
                  </Typography>
                </Box>
              </Grid>
              {materials.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Existing Materials
                    </Typography>
                  </Grid>
                  {materials.map((material) => (
                    <Grid item xs={12} key={material.id}>
                      <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1">
                              {material.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {material.description}
                            </Typography>
                            <Chip
                              label={material.fileType.toUpperCase()}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            href={material.fileUrl}
                            target="_blank"
                          >
                            Download
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleUpload}
              variant="contained"
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : null}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default MaterialsUpload;
