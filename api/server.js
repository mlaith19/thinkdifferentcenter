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
const seedSuperAdmin = require("./scripts/seedSuperAdmin");
const seedDummyData = require("./scripts/seedDummyData");
const sessionRoutes = require('./routes/sessionRoutes');


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
//    app.use(limiter);

// Body parser middleware
app.use(bodyParser.json());

// Function to check if data is already seeded
const isDataSeeded = async () => {
  try {
    const courseCount = await sequelize.models.Course.count();
    const sessionCount = await sequelize.models.Session.count();
    return courseCount > 0 && sessionCount > 0;
  } catch (error) {
    console.error("Error checking seeded data:", error);
    return false;
  }
};

// Function to sync database and seed data
const syncDatabase = async () => {
  try {
    // Force sync to recreate all tables
    await sequelize.sync({ force: true });
    console.log("Database tables have been synced.");

    // Seed roles and permissions first
    await seedRolesAndPermissions();
    console.log("Roles and permissions seeded.");

    // Seed super admin if not already seeded
    await seedSuperAdmin();
    console.log("Super admin account created successfully");

    // Seed dummy data
    console.log("Seeding dummy data...");
    // await seedDummyData();
    console.log("Dummy data seeded successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

 


// Initialize the server
const initializeServer = async () => {
  // Sync database tables
  await syncDatabase();

  // Seed roles and permissions
  await seedRolesAndPermissions();

  // Create super admin account
 

  // Routes
  const userRoutes = require("./routes/userRoutes");
  const instituteRoutes = require("./routes/instituteRoutes");
  const teacherRoutes = require("./routes/TeacherRoute");
  const studentRoutes = require("./routes/StudentRoute");
  const accountantRoutes = require("./routes/AccountantRoute");
  const crmRoutes = require("./routes/CRMRoute");
  const taskRoutes = require("./routes/TaskRoute");
  const notificationRoutes = require("./routes/NotificationRoute");
  const courseRoutes = require("./routes/CourseRoute"); 
  const attendanceRoutes = require("./routes/attendance");
  const seedRoutes = require("./routes/seedRoutes");

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
  app.use("/api/courses", courseRoutes);
  app.use("/api/attendance", attendanceRoutes);
  app.use('/api/sessions', sessionRoutes);
  
  // Only enable seed routes in development
  if (process.env.NODE_ENV === "development") {
    app.use("/api/seed", seedRoutes);
  }
  
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
/*

Teacher credentials:
Username: Danielle_Schimmel
Email: Danielle_Schimmel@yahoo.com     
Password: teacher123

Student credentials:
Student 1:
Username: Caterina.Oberbrunner
Email: Caterina_Oberbrunner@yahoo.com
Password: student123
Student 2:
Username: Jane_Walsh
Email: Jane_Walsh31@gmail.com
Password: student123
Student 3:
Username: Gina.Mertz
Email: Gina_Mertz29@gmail.com
Password: student123
Student 4:
Username: Erin.Jakubowski
Email: Erin_Jakubowski97@gmail.com
Password: student123
Student 5:
Username: Buddy.Kozey
Email: Buddy_Kozey@hotmail.com
Password: student123
Seeding completed
PS E:\Educational Institute Management System\thinkdifferentcenter> 
*/