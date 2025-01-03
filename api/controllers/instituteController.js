const Institute = require("../models/Institute");
const User = require("../models/User");
const Branch = require("../models/Branch");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/errorHandler");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, userType: user.userType },
    process.env.JWT_SECRET || "jwt_secret_key",
    { expiresIn: "1h" }
  );
};

// Create a new institute account
const createInstitute = async (req, res) => {
  const { name, email, password, adminName } = req.body;

  try {
    const existingInstitute = await Institute.findOne({ where: { email } });
    if (existingInstitute) {
      return res.status(409).json({ message: "Institute already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the institute
    const newInstitute = await Institute.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create a branch for the institute if it doesn't have one
    const instituteBranch = await Branch.create({
      name: `${newInstitute.name} Branch`, // Branch name
      instituteId: newInstitute.id, // Link branch to the created institute
    });

    // Create the institute admin user and assign the branchId
    const adminUser = await User.create({
      username: adminName,
      email,
      password: hashedPassword,
      fullName: adminName,
      userType: "institute_admin",
      branchId: instituteBranch.id, // Assign the created branch to the admin user
    });

    const token = generateToken(adminUser);

    res.status(201).json({
      message: "Institute created successfully.",
      institute: newInstitute,
      admin: adminUser,
      branch: instituteBranch,
      token,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};
const createBranch = async (req, res) => {
    const { name, address, phone } = req.body;
    const instituteId = req.params.instituteId; // Get institution ID from the URL
  
    try {
      // Check if the institution exists
      const institute = await Institute.findByPk(instituteId);
      if (!institute) {
        return res.status(404).json({ message: "Institute not found." });
      }
  
      // Create the branch
      const newBranch = await Branch.create({
        name,
        instituteId,
        address,
        phone,
      });
  
      res.status(201).json({
        message: "Branch created successfully.",
        branch: newBranch,
      });
    } catch (error) {
      const { statusCode, errorMessage, errorDetails } = handleError(error);
      res.status(statusCode).json({ message: errorMessage, errorDetails });
    }
  };

module.exports = { createInstitute , createBranch};
