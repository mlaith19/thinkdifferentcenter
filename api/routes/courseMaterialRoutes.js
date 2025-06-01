const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth_JWT');
const { upload, handleUploadError } = require('../middlewares/fileUpload');
const {
  getCourseMaterials,
  uploadMaterial,
  updateMaterial,
  deleteMaterial
} = require('../controllers/CourseMaterialController');

// Get all materials for a course
router.get('/course/:courseId', authenticate, getCourseMaterials);

// Upload new material
router.post('/course/:courseId', 
  authenticate, 
  upload.single('file'),
  handleUploadError,
  uploadMaterial
);

// Update material
router.put('/:materialId', 
  authenticate, 
  upload.single('file'),
  handleUploadError,
  updateMaterial
);

// Delete material
router.delete('/:materialId', authenticate, deleteMaterial);

module.exports = router; 