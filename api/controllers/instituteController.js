const Institute = require("../models/Institute");
const User = require("../models/User");
const Branch = require("../models/Branch");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/errorHandler");
const { generateLicenseKey, encryptLicenseKey, decryptLicenseKey } = require("../utils/LicenseKeyService");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "jwt_secret_key",
    { expiresIn: "200h" }
  );
};

// Create a new institute account
const createInstitute = async (req, res) => {
  const { name, email, password, adminName, startDate, endDate, address, phone } = req.body;

  try {
    const existingInstitute = await Institute.findOne({ where: { email } });
    if (existingInstitute) {
      return res.status(409).json({
        succeed: false,
        message: "Institute already exists.",
        data: null,
        errorDetails: {},
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const now = new Date();
    const defaultStartDate = startDate ? new Date(startDate) : now;
    const defaultEndDate = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    if (defaultStartDate >= defaultEndDate) {
      return res.status(400).json({
        succeed: false,
        message: "End date must be after start date.",
        data: null,
        errorDetails: {},
      });
    }

    const rawLicenseKey = generateLicenseKey(defaultStartDate.toISOString(), defaultEndDate.toISOString());
    const encryptedLicenseKey = encryptLicenseKey(rawLicenseKey);

    const newInstitute = await Institute.create({
      name,
      email,
      password: hashedPassword,
      licenseKey: encryptedLicenseKey,
    
    });

    const instituteBranch = await Branch.create({
      name: `${newInstitute.name}`,
      instituteId: newInstitute.id,
      address: address,
      phone:  phone
    });

    const adminUser = await User.create({
      username: adminName,
      email,
      password: hashedPassword,
      fullName: adminName,
      role: "institute_admin",
      branchId: instituteBranch.id,
      instituteId: newInstitute.id,
    });

    const token = generateToken(adminUser);

    res.status(201).json({
      succeed: true,
      message: "Institute created successfully.",
      data: {
        institute: newInstitute,
        admin: adminUser,
        branch: instituteBranch,
        licenseKey: rawLicenseKey,
        token,
      },
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};

// Create a new branch
const createBranch = async (req, res) => {
  const { name, address, phone } = req.body;
  const instituteId = req.params.instituteId; // Get institution ID from the URL

  try {
    // Check if the institution exists
    const institute = await Institute.findByPk(instituteId);
    if (!institute) {
      return res.status(404).json({
        succeed: false,
        message: "Institute not found.",
        data: null,
        errorDetails: {},
      });
    }

    // Create the branch
    const newBranch = await Branch.create({
      name,
      instituteId,
      address,
      phone,
    });

    res.status(201).json({
      succeed: true,
      message: "Branch created successfully.",
      data: newBranch,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};

// Get all institutes
const getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.findAll({
      include: [
        {
          model: User,
          as: "admin", // Alias for the admin relationship
          attributes: ["id", "username", "email", "fullName"],
        },
        {
          model: Branch,
          as: "branches", // Use the alias defined in the association
          attributes: ["id", "name", "address", "phone"],
        },
      ],
    });

    // Decrypt licenseKey and extract startDate and endDate for each institute
    const institutesWithDates = institutes.map((institute) => {
      try {
        const decryptedLicenseKey = decryptLicenseKey(institute.licenseKey);

        // Extract startDate and endDate from the decryptedLicenseKey
        const [startDateISO, endDateISO] = decryptedLicenseKey.split("||").slice(0, 2);

        // Parse the ISO dates and format them as YYYY-MM-DD
        const startDate = startDateISO.split("T")[0];
        const endDate = endDateISO.split("T")[0];

        return {
          ...institute.toJSON(),
          startDate,
          endDate,
        };
      } catch (decryptError) {
        console.error("Failed to decrypt licenseKey for institute:", institute.id, decryptError);
        return {
          ...institute.toJSON(),
          startDate: null,
          endDate: null,
        };
      }
    });

    res.status(200).json({
      succeed: true,
      message: "Institutes fetched successfully.",
      data: institutesWithDates,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};

// Get institute by ID
const getInstituteById = async (req, res) => {
  const instituteId = req.params.id;

  try {
    const institute = await Institute.findByPk(instituteId, {
      include: [
        {
          model: User,
          as: "admin",
          attributes: ["id", "username", "email", "fullName"],
        },
        {
          model: Branch,
          as: "branches",
          attributes: ["id", "name", "address", "phone"],
          include: [
            {
              model: User,
              attributes: ["id", "fullName", "email", "role"],
            },
          ],
        },
      ],
    });

    if (!institute) {
      return res.status(404).json({
        succeed: false,
        message: "Institute not found.",
        data: null,
        errorDetails: null,
      });
    }

    // Decrypt licenseKey and extract startDate and endDate
    const decryptedLicenseKey = decryptLicenseKey(institute.licenseKey);
    const [startDateISO, endDateISO] = decryptedLicenseKey.split("||").slice(0, 2);
    const startDate = startDateISO.split("T")[0];
    const endDate = endDateISO.split("T")[0];

    const instituteData = {
      ...institute.toJSON(),
      startDate,
      endDate,
    };

    res.status(200).json({
      succeed: true,
      message: "Institute fetched successfully.",
      data: instituteData,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};

const deleteAllInstitutes = async (req, res) => {
  try {
    // Delete all branches first since they are linked to institutes
    await Branch.destroy({ where: {} });

    // Then delete all institutes
    await Institute.destroy({ where: {} });

    res.status(200).json({
      succeed: true,
      message: "All institutes and their branches have been deleted successfully.",
      data: null,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};

const getBranchesByInstituteId = async (req, res) => {
  try {
    // Get instituteId from token, body, or query
    const instituteIdFromToken = req.user?.instituteId;
    const instituteIdFromBody = req.body?.instituteId;
    const instituteIdFromQuery = req.query?.instituteId;

    // Determine the instituteId to use
    const instituteId = instituteIdFromToken || instituteIdFromBody || instituteIdFromQuery;

    // If no instituteId is found
    if (!instituteId) {
      return res.status(400).json({
        succeed: false,
        message: "Institute ID is required. Provide it in the token, body, or query parameters.",
        data: null,
        errorDetails: null,
      });
    }

    console.log("Institute ID used for query:", instituteId); // Debugging log

    // Fetch branches for the given instituteId
    const branches = await Branch.findAll({
      where: { instituteId },
      attributes: ["id", "name", "address", "phone", "createdAt", "instituteId"],
    });

    // Handle case where no branches are found
    if (!branches || branches.length === 0) {
      return res.status(404).json({
        succeed: false,
        message: `No branches found for institute ID ${instituteId}.`,
        data: null,
        errorDetails: null,
      });
    }

    // Return the branches
    res.status(200).json({
      succeed: true,
      message: `Branches fetched successfully for institute ID ${instituteId}.`,
      data: branches,
      errorDetails: null,
    });
  } catch (error) {
    console.error("Error fetching branches:", error); // Log the error
    res.status(500).json({
      succeed: false,
      message: "An error occurred while fetching branches.",
      data: null,
      errorDetails: error.message,
    });
  }
};

const deleteInstituteById = async (req, res) => {
  const instituteId = req.params.id; // Get the institute ID from the URL

  try {
    // Check if the institute exists
    const institute = await Institute.findByPk(instituteId);
    if (!institute) {
      return res.status(404).json({
        succeed: false,
        message: "Institute not found.",
        data: null,
        errorDetails: null,
      });
    }

    // Delete all branches associated with the institute
    await Branch.destroy({ where: { instituteId } });

    // Delete the institute
    await Institute.destroy({ where: { id: instituteId } });

    res.status(200).json({
      succeed: true,
      message: "Institute and its associated branches have been deleted successfully.",
      data: null,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};
const deleteBranch = async (req, res) => {
  const { instituteId, branchId } = req.params;

  try {
    const branch = await Branch.findOne({ where: { id: branchId, instituteId } });
    if (!branch) {
      return res.status(404).json({
        succeed: false,
        message: "Branch not found.",
        data: null,
        errorDetails: null,
      });
    }

    await branch.destroy();
    res.status(200).json({
      succeed: true,
      message: "Branch deleted successfully.",
      data: null,
      errorDetails: null,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({
      succeed: false,
      message: errorMessage,
      data: null,
      errorDetails,
    });
  }
};
module.exports = {
  createInstitute,
  createBranch,
  getAllInstitutes,
  getInstituteById,
  deleteAllInstitutes,
  deleteInstituteById,
  getBranchesByInstituteId, deleteBranch
};