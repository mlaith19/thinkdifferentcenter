const express = require("express");
const { body } = require("express-validator");
const instituteController = require("../controllers/instituteController");
const { authenticate } = require("../middlewares/auth_JWT");
const { authorizeSuperAdmin } = require("../middlewares/authorizeSuperAdmin.js");
const { authorizeAdmin } = require("../middlewares/authorizeAdmin.js");
const router = express.Router();

// Create a new institute
router.post(
  "/create", 
  authenticate,       // First authenticate the user
   [
    body("name").not().isEmpty().withMessage("Institute name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    body("adminName").not().isEmpty().withMessage("Admin name is required."),
  ],
  instituteController.createInstitute // Controller to handle creation
);

// Create a new branch for a specific institution
router.post(
    "/:instituteId/branch", 
    authenticate,       // Authenticate the user
     [
      body("name").not().isEmpty().withMessage("Branch name is required."),
      body("address").optional(),
      body("phone").optional(),
    ],
    instituteController.createBranch // Controller to handle branch creation
  );

// Get all institutes
router.get("/", authenticate,  instituteController.getAllInstitutes);

// Get institute by ID
router.get("/:id", authenticate,   instituteController.getInstituteById);

// Delete all institutes
router.delete(
  "/delete-all",
  authenticate,          // Authenticate the user
    // Ensure only super admin can delete
  instituteController.deleteAllInstitutes // Controller to handle deletion
);
router.put(
  "/:id",
  authenticate,
 
  [
    body("name").optional().notEmpty(),
    body("email").optional().isEmail(),
    body("startDate").optional().isISO8601(),
    body("endDate").optional().isISO8601(),
    body("admin.fullName").optional().notEmpty(),
    body("admin.email").optional().isEmail(),
  ],
  instituteController.updateInstitute
);
// Get branches by institute ID
router.get(
  "/branch",
  authenticate,    
  instituteController.getBranchesByInstituteId  
);
router.get("/:instituteId/branches",   authenticate, instituteController.getBranchesByInstituteIdPath);
// Delete institute by ID
router.delete(
  "/:id", 
  authenticate,          // Authenticate the user
    // Ensure only super admin can delete
  instituteController.deleteInstituteById // Controller to handle deletion by ID
);
router.delete(
  "/:instituteId/branch/:branchId",
  authenticate,
 
  instituteController.deleteBranch
);
router.post(
  "/:instituteId/branch", 
  authenticate,
 
  [
    body("name").not().isEmpty().withMessage("Branch name is required."),
    body("address").optional(),
    body("phone").optional(),
  ],
  instituteController.createBranch
);
 
// Get financial reports for an institute
router.get("/:instituteId/financial-reports", authenticate, instituteController.getFinancialReports);

// Get courses for an institute
router.get("/:instituteId/courses", authenticate, instituteController.getCourses);
module.exports = router;