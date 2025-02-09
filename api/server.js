const express = require("express");
const { User, Role } = require("./models/associations"); 
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const dotenv = require("dotenv");
const { sequelize } = require("./assets/SQLDB/db");
 
const bcrypt = require("bcrypt");
const seedRolesAndPermissions = require("./scripts/roleSeeder");


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Sanitize data to prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

// CORS setup
const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// // Rate limiting middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Body parser middleware
app.use(bodyParser.json());

// Database synchronization
const syncDatabase = async () => {
  try {
    await sequelize.sync({   });  
    console.log("Database tables have been synced.");
  } catch (err) {
    console.error("Error syncing database:", err);
  }
};

// Create super admin account
const createSuperAdmin = async () => {
  try {
    const superAdminEmail = "super@admin.com";

    // Check if a super admin already exists
    const existingAdmin = await User.findOne({ where: { email: superAdminEmail } });

    if (existingAdmin) {
      console.log("Super admin account already exists.");
      return;
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash("Admin@123456", 10);

    // Create the super admin account
    await User.create({
      username: "super admin",
      email: superAdminEmail,
      password: hashedPassword,
      fullName: "Super Admin",
      role: "super_admin", // Directly assign the role
    });

    console.log("Super admin account created successfully.");
  } catch (error) {
    console.error("Error creating super admin account:", error);
  }
};


// Initialize the server
const initializeServer = async () => {
  // Sync database tables
  await syncDatabase();

  // Seed roles and permissions
  await seedRolesAndPermissions();

  // Create super admin account
  await createSuperAdmin();

  // Routes
  const userRoutes = require("./routes/userRoutes");
  const instituteRoutes = require("./routes/instituteRoutes");
  const teacherRoutes = require("./routes/TeacherRoute");
  const studentRoutes = require("./routes/StudentRoute");
  const accountantRoutes = require("./routes/AccountantRoute");
  const crmRoutes = require("./routes/CRMRoute");
  const taskRoutes = require("./routes/TaskRoute");
  const notificationRoutes = require("./routes/NotificationRoute");

  app.use("/api/tasks", taskRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/users", userRoutes);
  app.use((req, res, next) => {
    req.auditUser = req.user?.id || null;
    next();
  });
  app.use("/api/institute", instituteRoutes);
  app.use("/api/teacher", teacherRoutes);
  app.use("/api/student", studentRoutes);
  app.use("/api/accountant", accountantRoutes);
  app.use("/api/crm", crmRoutes);
  app.use((req, res, next) => {
    res.status(404).json({
      succeed: false,
      message: 'Route not found.',
      data: null,
      errorDetails: {
        code: 404,
        details: `The requested URL ${req.originalUrl} was not found on this server.`
      }
    });
  });
  // Start the server
  const PORT = process.env.DEV_API_PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

// Run the server initialization
initializeServer().catch((err) => {
  console.error("Failed to initialize server:", err);
});