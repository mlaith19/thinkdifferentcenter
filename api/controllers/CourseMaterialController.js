const CourseMaterial = require("../models/CourseMaterial");
const Course = require("../models/Course");
const User = require("../models/User");
const { handleError } = require("../utils/errorHandler");
const { Op } = require("sequelize");

// Get all materials for a course
const getCourseMaterials = async (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.query; // Optional: to check if student is enrolled

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        succeed: false,
        message: "Course not found",
        data: null,
        errorDetails: null
      });
    }

    // If studentId is provided, check if student is enrolled
    if (studentId) {
      const isEnrolled = await course.hasStudent(studentId);
      if (!isEnrolled) {
        return res.status(403).json({
          succeed: false,
          message: "You are not enrolled in this course",
          data: null,
          errorDetails: null
        });
      }
    }

    const materials = await CourseMaterial.findAll({
      where: { 
        courseId,
        [Op.or]: [
          { isPublic: true },
          { uploadedBy: req.user.id } // Teacher can see their own private materials
        ]
      },
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      succeed: true,
      message: "Course materials fetched successfully",
      data: materials,
      errorDetails: null
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails
    });
  }
};

// Upload new material
const uploadMaterial = async (req, res) => {
  const { courseId } = req.params;
  const { title, description, type, isPublic } = req.body;
  const file = req.file; // Assuming you're using multer for file upload

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        succeed: false,
        message: "Course not found",
        data: null,
        errorDetails: null
      });
    }

    // Check if user is the course teacher
    const isTeacher = await course.hasTeacher(req.user.id);
    if (!isTeacher) {
      return res.status(403).json({
        succeed: false,
        message: "Only course teachers can upload materials",
        data: null,
        errorDetails: null
      });
    }

    const material = await CourseMaterial.create({
      courseId,
      title,
      description,
      type,
      isPublic: isPublic || true,
      fileUrl: file ? file.path : null,
      fileType: file ? file.mimetype : null,
      fileSize: file ? file.size : null,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      succeed: true,
      message: "Material uploaded successfully",
      data: material,
      errorDetails: null
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails
    });
  }
};

// Update material
const updateMaterial = async (req, res) => {
  const { materialId } = req.params;
  const { title, description, type, isPublic } = req.body;
  const file = req.file;

  try {
    const material = await CourseMaterial.findByPk(materialId);
    if (!material) {
      return res.status(404).json({
        succeed: false,
        message: "Material not found",
        data: null,
        errorDetails: null
      });
    }

    // Check if user is the uploader
    if (material.uploadedBy !== req.user.id) {
      return res.status(403).json({
        succeed: false,
        message: "Only the uploader can update this material",
        data: null,
        errorDetails: null
      });
    }

    await material.update({
      title,
      description,
      type,
      isPublic,
      fileUrl: file ? file.path : material.fileUrl,
      fileType: file ? file.mimetype : material.fileType,
      fileSize: file ? file.size : material.fileSize
    });

    res.status(200).json({
      succeed: true,
      message: "Material updated successfully",
      data: material,
      errorDetails: null
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails
    });
  }
};

// Delete material
const deleteMaterial = async (req, res) => {
  const { materialId } = req.params;

  try {
    const material = await CourseMaterial.findByPk(materialId);
    if (!material) {
      return res.status(404).json({
        succeed: false,
        message: "Material not found",
        data: null,
        errorDetails: null
      });
    }

    // Check if user is the uploader
    if (material.uploadedBy !== req.user.id) {
      return res.status(403).json({
        succeed: false,
        message: "Only the uploader can delete this material",
        data: null,
        errorDetails: null
      });
    }

    await material.destroy();

    res.status(200).json({
      succeed: true,
      message: "Material deleted successfully",
      data: null,
      errorDetails: null
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails
    });
  }
};

module.exports = {
  getCourseMaterials,
  uploadMaterial,
  updateMaterial,
  deleteMaterial
}; 